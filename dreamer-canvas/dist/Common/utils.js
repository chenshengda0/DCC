var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const sleep = (wait = 1000) => __awaiter(void 0, void 0, void 0, function* () { return yield new Promise((resolve, reject) => window.setTimeout(resolve, wait)); });
export const runtimeDecorator = function () {
    return (target, method, descriptor) => {
        descriptor.value = new Proxy(descriptor.value, {
            apply: function (...args) {
                console.error(`============================================================START: ${method} ============================================================`);
                try {
                    console.error("time: ", new Date());
                    console.error("args: ", args);
                    return Reflect.apply(...args);
                }
                catch (err) {
                    console.error(err);
                }
                finally {
                    console.error(`==============================================================END: ${method} ============================================================`);
                }
            }
        });
    };
};
