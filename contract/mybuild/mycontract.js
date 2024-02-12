function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object.keys(descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;
  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }
  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);
  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }
  if (desc.initializer === void 0) {
    Object.defineProperty(target, property, desc);
    desc = null;
  }
  return desc;
}

var PromiseResult;
(function (PromiseResult) {
  PromiseResult[PromiseResult["NotReady"] = 0] = "NotReady";
  PromiseResult[PromiseResult["Successful"] = 1] = "Successful";
  PromiseResult[PromiseResult["Failed"] = 2] = "Failed";
})(PromiseResult || (PromiseResult = {}));
var PromiseError;
(function (PromiseError) {
  PromiseError[PromiseError["Failed"] = 0] = "Failed";
  PromiseError[PromiseError["NotReady"] = 1] = "NotReady";
})(PromiseError || (PromiseError = {}));

function u8ArrayToBytes(array) {
  let ret = "";
  for (let e of array) {
    ret += String.fromCharCode(e);
  }
  return ret;
}

var CurveType;
(function (CurveType) {
  CurveType[CurveType["ED25519"] = 0] = "ED25519";
  CurveType[CurveType["SECP256K1"] = 1] = "SECP256K1";
})(CurveType || (CurveType = {}));

const U64_MAX = 2n ** 64n - 1n;
const EVICTED_REGISTER = U64_MAX - 1n;
function log(...params) {
  env.log(`${params.map(x => x === undefined ? 'undefined' : x) // Stringify undefined
  .map(x => typeof x === 'object' ? JSON.stringify(x) : x) // Convert Objects to strings
  .join(' ')}` // Convert to string
  );
}
function predecessorAccountId() {
  env.predecessor_account_id(0);
  return env.read_register(0);
}
function storageRead(key) {
  let ret = env.storage_read(key, 0);
  if (ret === 1n) {
    return env.read_register(0);
  } else {
    return null;
  }
}
function storageGetEvicted() {
  return env.read_register(EVICTED_REGISTER);
}
function input() {
  env.input(0);
  return env.read_register(0);
}
function storageWrite(key, value) {
  let exist = env.storage_write(key, value, EVICTED_REGISTER);
  if (exist === 1n) {
    return true;
  }
  return false;
}
function storageRemove(key) {
  let exist = env.storage_remove(key, EVICTED_REGISTER);
  if (exist === 1n) {
    return true;
  }
  return false;
}

function call(target, key, descriptor) {}
function view(target, key, descriptor) {}
function NearBindgen({
  requireInit = false
}) {
  return target => {
    return class extends target {
      static _create() {
        return new target();
      }
      static _getState() {
        const rawState = storageRead("STATE");
        return rawState ? this._deserialize(rawState) : null;
      }
      static _saveToStorage(obj) {
        storageWrite("STATE", this._serialize(obj));
      }
      static _getArgs() {
        return JSON.parse(input() || "{}");
      }
      static _serialize(value) {
        return JSON.stringify(value);
      }
      static _deserialize(value) {
        return JSON.parse(value);
      }
      static _reconstruct(classObject, plainObject) {
        for (const item in classObject) {
          if (classObject[item].constructor?.deserialize !== undefined) {
            classObject[item] = classObject[item].constructor.deserialize(plainObject[item]);
          } else {
            classObject[item] = plainObject[item];
          }
        }
        return classObject;
      }
      static _requireInit() {
        return requireInit;
      }
    };
  };
}

const ERR_INDEX_OUT_OF_BOUNDS = "Index out of bounds";
const ERR_INCONSISTENT_STATE = "The collection is an inconsistent state. Did previous smart contract execution terminate unexpectedly?";
function indexToKey(prefix, index) {
  let data = new Uint32Array([index]);
  let array = new Uint8Array(data.buffer);
  let key = u8ArrayToBytes(array);
  return prefix + key;
}
/// An iterable implementation of vector that stores its content on the trie.
/// Uses the following map: index -> element
class Vector {
  constructor(prefix) {
    this.length = 0;
    this.prefix = prefix;
  }
  isEmpty() {
    return this.length == 0;
  }
  get(index) {
    if (index >= this.length) {
      return null;
    }
    let storageKey = indexToKey(this.prefix, index);
    return JSON.parse(storageRead(storageKey));
  }
  /// Removes an element from the vector and returns it in serialized form.
  /// The removed element is replaced by the last element of the vector.
  /// Does not preserve ordering, but is `O(1)`.
  swapRemove(index) {
    if (index >= this.length) {
      throw new Error(ERR_INDEX_OUT_OF_BOUNDS);
    } else if (index + 1 == this.length) {
      return this.pop();
    } else {
      let key = indexToKey(this.prefix, index);
      let last = this.pop();
      if (storageWrite(key, JSON.stringify(last))) {
        return JSON.parse(storageGetEvicted());
      } else {
        throw new Error(ERR_INCONSISTENT_STATE);
      }
    }
  }
  push(element) {
    let key = indexToKey(this.prefix, this.length);
    this.length += 1;
    storageWrite(key, JSON.stringify(element));
  }
  pop() {
    if (this.isEmpty()) {
      return null;
    } else {
      let lastIndex = this.length - 1;
      let lastKey = indexToKey(this.prefix, lastIndex);
      this.length -= 1;
      if (storageRemove(lastKey)) {
        return JSON.parse(storageGetEvicted());
      } else {
        throw new Error(ERR_INCONSISTENT_STATE);
      }
    }
  }
  replace(index, element) {
    if (index >= this.length) {
      throw new Error(ERR_INDEX_OUT_OF_BOUNDS);
    } else {
      let key = indexToKey(this.prefix, index);
      if (storageWrite(key, JSON.stringify(element))) {
        return JSON.parse(storageGetEvicted());
      } else {
        throw new Error(ERR_INCONSISTENT_STATE);
      }
    }
  }
  extend(elements) {
    for (let element of elements) {
      this.push(element);
    }
  }
  [Symbol.iterator]() {
    return new VectorIterator(this);
  }
  clear() {
    for (let i = 0; i < this.length; i++) {
      let key = indexToKey(this.prefix, i);
      storageRemove(key);
    }
    this.length = 0;
  }
  toArray() {
    let ret = [];
    for (let v of this) {
      ret.push(v);
    }
    return ret;
  }
  serialize() {
    return JSON.stringify(this);
  }
  // converting plain object to class object
  static deserialize(data) {
    let vector = new Vector(data.prefix);
    vector.length = data.length;
    return vector;
  }
}
class VectorIterator {
  constructor(vector) {
    this.current = 0;
    this.vector = vector;
  }
  next() {
    if (this.current < this.vector.length) {
      let value = this.vector.get(this.current);
      this.current += 1;
      return {
        value,
        done: false
      };
    }
    return {
      value: null,
      done: true
    };
  }
}

var _dec, _class, _class2;
let Storage = (_dec = NearBindgen({}), _dec(_class = (_class2 = class Storage {
  data = new Vector('data-id');
  points = 0;
  view_data() {
    return this.data.toArray();
  }
  get_data({
    url,
    contract_name
  }) {
    const account_id = predecessorAccountId();
    this.points += 1;
    this.data.push({
      account_id: account_id,
      contract_name: contract_name,
      url: url,
      points: this.points
    });
    log(`Data Insersation Was Successfull!`);
  }
  view_accountDetails() {
    const account_id = predecessorAccountId();
    // View Data data for this account only
    const accountData = new Vector('d');
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].account_id == account_id) {
        accountData.push(this.data[i]);
      }
    }
    return accountData.toArray();
  }
}, (_applyDecoratedDescriptor(_class2.prototype, "view_data", [view], Object.getOwnPropertyDescriptor(_class2.prototype, "view_data"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "get_data", [call], Object.getOwnPropertyDescriptor(_class2.prototype, "get_data"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "view_accountDetails", [call], Object.getOwnPropertyDescriptor(_class2.prototype, "view_accountDetails"), _class2.prototype)), _class2)) || _class);
function view_accountDetails() {
  let _state = Storage._getState();
  if (!_state && Storage._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  let _contract = Storage._create();
  if (_state) {
    Storage._reconstruct(_contract, _state);
  }
  let _args = Storage._getArgs();
  let _result = _contract.view_accountDetails(_args);
  Storage._saveToStorage(_contract);
  if (_result !== undefined) env.value_return(Storage._serialize(_result));
}
function get_data() {
  let _state = Storage._getState();
  if (!_state && Storage._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  let _contract = Storage._create();
  if (_state) {
    Storage._reconstruct(_contract, _state);
  }
  let _args = Storage._getArgs();
  let _result = _contract.get_data(_args);
  Storage._saveToStorage(_contract);
  if (_result !== undefined) env.value_return(Storage._serialize(_result));
}
function view_data() {
  let _state = Storage._getState();
  if (!_state && Storage._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  let _contract = Storage._create();
  if (_state) {
    Storage._reconstruct(_contract, _state);
  }
  let _args = Storage._getArgs();
  let _result = _contract.view_data(_args);
  if (_result !== undefined) env.value_return(Storage._serialize(_result));
}

export { get_data, view_accountDetails, view_data };
//# sourceMappingURL=mycontract.js.map
