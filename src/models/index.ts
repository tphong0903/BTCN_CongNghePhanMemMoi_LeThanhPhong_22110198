import * as fs from "fs";
import * as path from "path";
import { Sequelize, DataTypes } from "sequelize";

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
// Đảm bảo file config.json của bạn ở đúng đường dẫn (ví dụ: ../config/config.json)
const config = require(path.join(__dirname, "..", "config", "config.json"))[env];

interface IDB {
  [key: string]: any;
  sequelize?: Sequelize;
  Sequelize?: typeof Sequelize;
}

const db: IDB = {};

let sequelize: Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
  .filter((file) => {
    const ext = path.extname(file);
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      (ext === ".js" || ext === ".ts") && // Cho phép cả .js và .ts
      !file.endsWith(".d.ts") &&
      file.indexOf(".test.") === -1
    );
  })
  .forEach((file) => {
    // Sửa lỗi 'modelFactory is not a function'
    const importedModule = require(path.join(__dirname, file));
    const modelFactory = importedModule.default || importedModule;
    
    const model = modelFactory(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;