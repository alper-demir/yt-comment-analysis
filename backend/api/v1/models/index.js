import User from "./user.model.js";
import Analize from './analize.model.js';
import UserPreference from "./userPrefences.model.js";
import Payment from "./payment.model.js";
import TokenPlan from "./tokenPlan.model.js";

// Relations

User.hasMany(Analize, { foreignKey: 'userId' });
Analize.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(UserPreference, { foreignKey: 'userId' });
UserPreference.belongsTo(User, { foreignKey: 'userId' });

// User 1 - n Payment relation
User.hasMany(Payment, { foreignKey: "userId" });
Payment.belongsTo(User, { foreignKey: "userId" });

Payment.belongsTo(TokenPlan, { foreignKey: 'planId' });
TokenPlan.hasMany(Payment, { foreignKey: 'planId' });