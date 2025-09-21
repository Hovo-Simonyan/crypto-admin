import { connectToDatabase } from "@/lib/mongoose";
import { Transaction, Balance } from "@/lib/models";

export async function GET() {
  await connectToDatabase();
  const transactions = await Transaction.find().sort({ createdAt: -1 }).populate('clientId', 'fullName');
  return Response.json(transactions);
}

export async function POST(req) {
  await connectToDatabase();
  const { clientId, whereAmountGo, fromWhereLeft, ...data } = await req.json();
  const newTx = await Transaction.create({
    ...data,
    clientId: clientId || null,
  });

  const defaultWallet = "Casa";
  const toWallet = whereAmountGo || defaultWallet;
  const fromWallet = fromWhereLeft || defaultWallet;

  async function updateBalance(walletName, currency, amountChange) {
    let wallet = await Balance.findOne({ name: walletName });

    const bal = wallet.balances.find(
      (b) => b.currency.toLowerCase() === currency.toLowerCase()
    );

    if (bal) {
      bal.amount += amountChange;
    }

    await wallet.save();
  }

  if (fromWallet) {
    await updateBalance(
      fromWallet,
      data.receivedCurrency,
      -data.receivedAmount
    );
  }

  if (toWallet) {
    await updateBalance(toWallet, data.givenCurrency, data.givenAmount);
  }

  return Response.json(newTx);
}
