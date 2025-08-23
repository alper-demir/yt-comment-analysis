import User from "./user.model.js";
import Analize from './analize.model.js';
import UserPreference from "./userPrefences.model.js";
import Purchase from "./purchase.model.js";
import TokenPlan from "./tokenPlan.model.js";

// Relations

User.hasMany(Analize, { foreignKey: 'userId' });
Analize.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(UserPreference, { foreignKey: 'userId' });
UserPreference.belongsTo(User, { foreignKey: 'userId' });

// User 1 - n Purchase relation
User.hasMany(Purchase, { foreignKey: "userId" });
Purchase.belongsTo(User, { foreignKey: "userId" });

Purchase.belongsTo(TokenPlan, { foreignKey: 'planId' });
TokenPlan.hasMany(Purchase, { foreignKey: 'planId' });