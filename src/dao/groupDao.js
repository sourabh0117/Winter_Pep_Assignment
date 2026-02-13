const Group = require("../model/group");

const groupDao = {
  createGroup: async (data) => {
    const newGroup = new Group(data);
    return await newGroup.save();
  },

  updateGroup: async (data) => {
    const {
      groupId,
      name,
      description,
      thumbnail,
      adminEmail,
      paymentStatus,
      lastSettledAt,
      totalExpenses,
      settledBy,
    } = data;

    const updateData = {
      ...(name && { name }),
      ...(description && { description }),
      ...(thumbnail && { thumbnail }),
      ...(adminEmail && { adminEmail }),
      ...(paymentStatus && { paymentStatus }),
      ...(lastSettledAt && { lastSettledAt }),
      ...(totalExpenses !== undefined && { totalExpenses }),
      ...(settledBy && { settledBy }),
    };

    return await Group.findByIdAndUpdate(groupId, updateData, { new: true });
  },

  addMembers: async (groupId, ...membersEmails) => {
    return await Group.findByIdAndUpdate(
      groupId,
      {
        $addToSet: { membersEmail: { $each: membersEmails } },
      },
      { new: true },
    );
  },

  removeMembers: async (groupId, ...membersEmails) => {
    return await Group.findByIdAndUpdate(
      groupId,
      {
        $pull: { membersEmail: { $in: membersEmails } },
      },
      { new: true },
    );
  },

  getGroupByEmail: async (email) => {
    return await Group.find({ membersEmail: email });
  },

  getGroupByStatus: async (status) => {
    return await Group.find({ "paymentStatus.isPaid": status });
  },

  getAuditLog: async (groupId) => {
    const group = await Group.findById(groupId).select("paymentStatus.date");
    return group ? group.paymentStatus.date : null;
  },
};

module.exports = groupDao;
