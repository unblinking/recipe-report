"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepo = void 0;
class BaseRepo {
    constructor(db, table) {
        this.createOne = (item) => __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO ${this._table} (${this.cols(item)}) VALUES (${this.pars(item)}) RETURNING *`;
            const result = yield this._db.query(query, this.vals(item));
            return result;
        });
        this.findOneById = (id) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this._db.query(`SELECT * FROM ${this._table} WHERE id = $1`, [id]);
            return result;
        });
        this.cols = (item) => {
            const columnsArray = [];
            Object.keys(item).forEach((column) => {
                const value = item[column];
                if (value !== null && value !== undefined) {
                    columnsArray.push(column);
                }
            });
            const columns = columnsArray.join(',');
            return columns;
        };
        this.vals = (item) => {
            const values = [];
            Object.keys(item).forEach((column) => {
                const value = item[column];
                if (value !== null && value !== undefined) {
                    values.push(value);
                }
            });
            return values;
        };
        this.pars = (item) => {
            const columnsArray = [];
            Object.keys(item).forEach((column) => {
                const value = item[column];
                if (value !== null && value !== undefined) {
                    columnsArray.push(column);
                }
            });
            const paramsArray = [];
            for (let i = 1; i <= columnsArray.length; i++) {
                paramsArray.push(`$` + i);
            }
            const parameters = paramsArray.join(',');
            return parameters;
        };
        this._db = db;
        this._table = table;
    }
}
exports.BaseRepo = BaseRepo;
//# sourceMappingURL=baserepo.js.map