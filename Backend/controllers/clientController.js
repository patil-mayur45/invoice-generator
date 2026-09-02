import Client from "../models/Client.js";
import Invoice from "../models/Invoice.js";

export const getClients = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = { userId: req.user._id };
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    const clients = await Client.find(query).sort({ name: 1 });
    res.json(clients);
  } catch (err) {
    next(err);
  }
};

export const getClient = async (req, res, next) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, userId: req.user._id });
    if (!client) return res.status(404).json({ message: "Client not found" });

    const invoices = await Invoice.find({ clientId: client._id, userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({ client, invoices });
  } catch (err) {
    next(err);
  }
};

export const createClient = async (req, res, next) => {
  try {
    const { name, email, phone, address } = req.body;
    if (!name) return res.status(400).json({ message: "Client name is required" });

    const client = await Client.create({
      userId: req.user._id,
      name,
      email,
      phone,
      address,
    });
    res.status(201).json(client);
  } catch (err) {
    next(err);
  }
};

export const updateClient = async (req, res, next) => {
  try {
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (err) {
    next(err);
  }
};

export const deleteClient = async (req, res, next) => {
  try {
    const inUse = await Invoice.exists({ clientId: req.params.id, userId: req.user._id });
    if (inUse) {
      return res.status(400).json({
        message: "This client has invoices attached and can't be deleted",
      });
    }
    const client = await Client.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json({ message: "Client deleted" });
  } catch (err) {
    next(err);
  }
};
