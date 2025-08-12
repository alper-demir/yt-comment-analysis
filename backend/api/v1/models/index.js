import User from "./user.model.js";
import Analize from './analize.model.js';
import UserPreference from "./userPrefences.model.js";

// Relations

User.hasMany(Analize, { foreignKey: 'userId' });
Analize.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(UserPreference, { foreignKey: 'userId' });
UserPreference.belongsTo(User, { foreignKey: 'userId' });