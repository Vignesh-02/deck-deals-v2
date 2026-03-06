const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

function loadEnv(filePath) {
  const abs = path.resolve(filePath);
  const text = fs.readFileSync(abs, 'utf8');
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnv('.env.local');

const MONGODB_URL = process.env.MONGODB_URL;
if (!MONGODB_URL) {
  throw new Error('MONGODB_URL is missing');
}

const DECK_TYPES = [
  'Bicycle',
  'fontaine',
  'Theory11',
  'Ellusionist',
  'NOCs',
  'Dan&Dave',
  'Bocopo',
  'Cartamundi',
  'Mint Playing Cards',
];

const usersSeed = [
  { username: 'selleralpha', email: 'seller.alpha@example.com' },
  { username: 'sellerbravo', email: 'seller.bravo@example.com' },
  { username: 'sellercharlie', email: 'seller.charlie@example.com' },
  { username: 'sellerdelta', email: 'seller.delta@example.com' },
  { username: 'sellerecho', email: 'seller.echo@example.com' },
];

async function main() {
  await mongoose.connect(MONGODB_URL);
  const usersCol = mongoose.connection.db.collection('users');
  const decksCol = mongoose.connection.db.collection('decks');

  const passwordHash = await bcrypt.hash('Seller@123', 12);

  const createdUsers = [];
  for (const seed of usersSeed) {
    const existing = await usersCol.findOne({ $or: [{ username: seed.username }, { email: seed.email }] });
    if (existing) {
      await usersCol.updateOne(
        { _id: existing._id },
        {
          $set: {
            username: seed.username,
            email: seed.email,
            role: 'seller',
            emailVerified: true,
            passwordHash,
          },
          $unset: {
            hash: '',
            salt: '',
            emailVerificationTokenHash: '',
            emailVerificationExpiresAt: '',
          },
        }
      );
      createdUsers.push({ _id: existing._id, username: seed.username, email: seed.email });
      continue;
    }

    const doc = {
      username: seed.username,
      email: seed.email,
      role: 'seller',
      emailVerified: true,
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const res = await usersCol.insertOne(doc);
    createdUsers.push({ _id: res.insertedId, username: seed.username, email: seed.email });
  }

  let typeIndex = 0;
  for (const user of createdUsers) {
    for (let i = 1; i <= 2; i++) {
      const deckType = DECK_TYPES[typeIndex % DECK_TYPES.length];
      typeIndex += 1;
      const deckName = `${deckType} Demo Deck ${i} (${user.username})`;

      const existingDeck = await decksCol.findOne({
        name: deckName,
        'author.id': user._id,
      });

      const payload = {
        name: deckName,
        mobile: '9999999999',
        email: user.email,
        deckType,
        address: '123 Demo Street, Test City',
        price: '999',
        stock: '10',
        description: `Seeded ${deckType} deck for ${user.username}`,
        images: [
          'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
        ],
        image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
        author: { id: user._id, username: user.username },
        comments: [],
        updatedAt: new Date(),
      };

      if (existingDeck) {
        await decksCol.updateOne({ _id: existingDeck._id }, { $set: payload });
      } else {
        await decksCol.insertOne({ ...payload, createdAt: new Date() });
      }
    }
  }

  const usersCount = await usersCol.countDocuments({ email: { $in: usersSeed.map((u) => u.email) } });
  const decksCount = await decksCol.countDocuments({ 'author.username': { $in: usersSeed.map((u) => u.username) } });

  console.log(`Seed complete: users=${usersCount}, decks=${decksCount}`);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  try { await mongoose.disconnect(); } catch (_) {}
  process.exit(1);
});
