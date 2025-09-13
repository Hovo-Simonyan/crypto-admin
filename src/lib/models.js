import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

// ======= 1. Клиенты =======
const ClientSchema = new Schema(
  {
    fullName: { type: String }, // Полное имя клиента
    email: { type: String, unique: true, index: true }, // Email, должен быть уникальным
    phone: { type: [String], default: [] }, // Массив номеров телефона
    idCard: { type: String }, // Паспортные данные (бывший "id")
    passport: { type: String }, // Старое поле, если ещё нужно

    notes: { type: String }, // Заметки по клиенту
    status: {
      type: String,
      enum: ["vip", "normal", "bad"],
    }, // Статус клиента
    clientBalances: [
      {
        currency: { type: String }, // Валюта
        amount: { type: Number, default: 0 }, // Сумма
      },
    ],
  },
  { timestamps: true } // Добавляет createdAt и updatedAt
);

// ======= 2. Админы =======
const AdminSchema = new Schema(
  {
    fullName: { type: String }, // Полное имя администратора
    email: { type: String, unique: true, index: true }, // Email
    password: { type: String }, // Хэшированный пароль
  },
  { timestamps: true } // createdAt и updatedAt
);

// ======= 3. Транзакции =======
const TransactionSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      index: true,
    }, // Reference to client

    type: { type: String, enum: ["buy", "sell"] }, // Transaction type

    givenCurrency: { type: String }, // Currency given (used to be cryptoCurrency)
    givenAmount: { type: Number }, // Amount given

    receivedCurrency: { type: String }, // Currency received (used to be fiatCurrency)
    receivedAmount: { type: Number }, // Amount received

    exchangeRate: { type: Number }, // Exchange rate

    note: { type: String }, // Comments, e.g. "credit", "paid"

    method: { type: String }, // Payment method: cash, online, usdt etc.

    percent: { type: Number, default: 0 }, // Percentage commission or fee

    donation: { type: Number, default: 0 }, // Donation amount (difference)
  },
  { timestamps: true }
);

// ======= 4. Курсы валют =======
const CourseSchema = new Schema(
  {
    name: { type: String, unique: true }, // Название валюты (USD, FTN и т.д.)

    sell: { type: Number }, // Курс продажи (продаем клиенту)
    buy: { type: Number }, // Курс покупки (покупаем у клиента)
  },
  { timestamps: true } // createdAt и updatedAt
);

// ======= 5. Балансы =======
const BalanceSchema = new Schema(
  {
    name: { type: String }, // Название кошелька (Safe, Binance и т.д.)
    image: { type: String }, // Ссылка на иконку

    // Несколько валют в одном кошельке
    balances: [
      {
        currency: { type: String }, // "usd", "eur", "usdt", "amd" и т.д.
        amount: { type: Number, default: 0 }, // Сумма для этой валюты
      },
    ],
  },
  { timestamps: true }
);

// ======= 6. Офисные расходы =======
const OfficeSaleSchema = new Schema(
  {
    title: { type: String }, // Название расхода (например, аренда, интернет, кофе)
    amount: { type: Number }, // Сумма
    currency: { type: String, enum: ["AMD"] }, // Валюта
    method: { type: String }, // Метод оплаты: cash, bank, card и т.д.
    note: { type: String }, // Дополнительные комментарии
    date: { type: Date, default: Date.now }, // Дата расхода
  },
  { timestamps: true }
);

// ======= 7. Investor =======
const InvestorSchema = new mongoose.Schema(
  {
    name: { type: String }, // Имя инвестора
    info: { type: String }, // Доп. информация
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    investments: [
      {
        currency: { type: String }, // Валюта вложения
        amount: { type: Number }, // Сумма вложения
        profit: { type: Number, default: 0 }, // Заработок
        startDate: { type: Date, default: Date.now },
        notes: { type: String }, // Комментарии
      },
    ],
  },
  { timestamps: true }
);

// ======= Экспорт моделей =======
export const Client = models.Client || model("Client", ClientSchema);
export const Admin = models.Admin || model("Admin", AdminSchema);
export const Transaction =
  models.Transaction || model("Transaction", TransactionSchema);
export const Course = models.Course || model("Course", CourseSchema);
export const Balance = models.Balance || model("Balance", BalanceSchema);
export const OfficeSale =
  models.OfficeSale || model("OfficeSale", OfficeSaleSchema);
export const Investor =
  mongoose.models.Investor || mongoose.model("Investor", InvestorSchema);
