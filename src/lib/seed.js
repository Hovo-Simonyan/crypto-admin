import bcrypt from "bcryptjs";
import { connectToDatabase } from "./mongoose.js";
import {
  Course,
  Balance,
  Client,
  Admin,
  Transaction,
  OfficeSale,
  Investor,
} from "./models.js";

async function seed() {
  await connectToDatabase();

  console.log("⏳ Очистка всех коллекций...");
  await Promise.all([
    Course.deleteMany(),
    Balance.deleteMany(),
    Client.deleteMany(),
    Admin.deleteMany(),
    Transaction.deleteMany(),
  ]);

  // ===== Seed: Курсы валют =====
  const courseSeed = [
    {
      name: "GEL",
      sell: 150,
      buy: 140,
    },
    {
      name: "GBP",
      sell: 510,
      buy: 500,
    },
    {
      name: "RUB",
      sell: 4.85,
      buy: 4.75,
    },
    {
      name: "EUR",
      sell: 450,
      buy: 445,
    },
    {
      name: "USD",
      sell: 1,
      buy: 382,
    },
    {
      name: "AMD",
      sell: 1,
      buy: 1,
    },
  ];

  // Используйте эту переменную courseSeed в вашем сидере:
  await Course.insertMany(courseSeed);
  console.log("✅ Курсы валют созданы");

  // ===== Seed: Балансы (кошельки) =====
  const balanceSeed = [
    {
      name: "Safe",
      image: "https://cdn-icons-png.flaticon.com/512/1524/1524855.png",
      balances: [
        { currency: "amd", amount: 100000 },
        { currency: "usd", amount: 2500 },
        { currency: "eur", amount: 600 },
      ],
    },
    {
      name: "Casa",
      image: "https://cdn-icons-png.flaticon.com/512/1524/1524855.png",
      balances: [
        { currency: "amd", amount: 50000 },
        { currency: "rub", amount: 3000 },
        { currency: "eur", amount: 1200 },
        { currency: "usd", amount: 900 },
      ],
    },
    {
      name: "Binance",
      image: "https://cdn-icons-png.flaticon.com/512/1524/1524855.png",
      balances: [{ currency: "usdt", amount: 15000 }],
    },
    {
      name: "Trust",
      image: "https://cdn-icons-png.flaticon.com/512/1524/1524855.png",
      balances: [{ currency: "usdt", amount: 3200 }],
    },
    {
      name: "Tutun",
      image: "https://cdn-icons-png.flaticon.com/512/1524/1524855.png",
      balances: [{ currency: "usdt", amount: 700 }],
    },
  ];

  await Balance.insertMany(balanceSeed);
  console.log("✅ Балансы созданы");

  // ===== Seed: Клиенты =====
  const client = await Client.create({
    fullName: "John Doe",
    email: "john@example.com",
    phone: ["+123456789"],
    idCard: "AB1234567",
    passport: "client123",
    notes: "Somethhing",
    status: "normal",
    clientBalances: [
      {
        currency: "USD",
        amount: 1500,
      },
      {
        currency: "AMD",
        amount: 350000,
      },
    ],
  });
  console.log("✅ Клиент создан");

  // ===== Seed: Админ =====
  const adminPassword = "admin123"; // пароль для входа
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

  await Admin.create({
    fullName: "Admin User",
    email: "admin@example.com",
    password: hashedAdminPassword, // хешированный пароль
  });
  console.log(`✅ Админ создан. Пароль: ${adminPassword}`);

  // ===== Seed: Транзакции (одна, связанная с клиентом) =====
  await Transaction.create({
    clientId: client._id, // ссылка на клиента
    type: "buy",
    givenCurrency: "BTC",
    givenAmount: 0.1,
    receivedCurrency: "USD",
    receivedAmount: 6000,
    exchangeRate: 60000,
    note: "Initial test transaction",
    method: "cash",
    percent: 1.5,
    donation: 0,
  });
  console.log("✅ Транзакция создана");

  // ===== Seed: Офисные расходы =====
  await OfficeSale.insertMany([
    {
      title: "Аренда офиса",
      amount: 500,
      currency: "AMD",
      category: "rent",
      description: "Аренда офиса за месяц",
    },
    {
      title: "Интернет",
      amount: 50,
      currency: "AMD",
      category: "utilities",
      description: "Оплата интернета",
    },
    {
      title: "Офисные принадлежности",
      amount: 120,
      currency: "AMD",
      category: "supplies",
      description: "Бумага, ручки, папки",
    },
    {
      title: "Зарплата менеджера",
      amount: 1000,
      currency: "AMD",
      category: "salary",
      description: "Зарплата офис-менеджеру",
    },
  ]);
  console.log("✅ Офисные расходы добавлены");

  // ===== Seed: Инвесторы =====
  const investorsData = [
    {
      name: "John Doe",
      info: "Long-term investor",
      status: "active",
      investments: [
        {
          currency: "BTC",
          amount: 0.5,
          profit: 1200,
          notes: "Initial BTC investment",
        },
        { currency: "ETH", amount: 5, profit: 300, notes: "Ethereum growth" },
      ],
    },
    {
      name: "Alice Smith",
      info: "Short-term investor",
      status: "active",
      investments: [
        {
          currency: "USD",
          amount: 10000,
          profit: 500,
          notes: "Cash investments",
        },
        {
          currency: "ADA",
          amount: 2000,
          profit: 200,
          notes: "Cardano staking",
        },
      ],
    },
    {
      name: "Bob Johnson",
      info: "Risk-taker",
      status: "inactive",
      investments: [
        {
          currency: "DOGE",
          amount: 10000,
          profit: 1000,
          notes: "Memecoin experiment",
        },
      ],
    },
  ];

  for (const inv of investorsData) {
    await Investor.create(inv);
  }
  console.log(`✅ Investors created`);

  console.log("🎉 Сидинг завершён!");
  process.exit();
}

seed().catch((err) => {
  console.error("❌ Ошибка при сидинге:", err);
  process.exit(1);
});
