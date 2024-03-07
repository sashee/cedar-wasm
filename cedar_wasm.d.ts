/* tslint:disable */
/* eslint-disable */
/**
* @param {string} json_str
* @returns {JsonToPolicyResult}
*/
export function policyTextFromJson(json_str: string): JsonToPolicyResult;
/**
* @param {string} cedar_str
* @returns {PolicyToJsonResult}
*/
export function policyTextToJson(cedar_str: string): PolicyToJsonResult;
/**
* @param {string} input_policies_str
* @returns {CheckParsePolicySetResult}
*/
export function checkParsePolicySet(input_policies_str: string): CheckParsePolicySetResult;
/**
* @param {string} input
* @returns {InterfaceResult}
*/
export function isAuthorized(input: string): InterfaceResult;
/**
* @param {string} input
* @returns {InterfaceResult}
*/
export function validate(input: string): InterfaceResult;
/**
* @returns {string}
*/
export function getCedarVersion(): string;
export type JsonToPolicyResult = { success: { policy_text: string } } | { error: { errors: string[] } };

export type PolicyToJsonResult = { policy: Policy } | { errors: string[] };

export type CheckParsePolicySetResult = { Success: { policies: number; templates: number } } | { SyntaxError: { errors: string[] } };

export type ValidationMode = "regular" | "off";

export interface ValidationSettings {
    mode: ValidationMode;
}

export interface ValidateCall {
    validationSettings?: ValidationSettings;
    schema: Schema;
    policySet: PolicySpecification;
}

export type InterfaceResult = { success: "true"; result: string } | { success: "false"; isInternal: boolean; errors: string[] };

export type PolicySpecification = string | Record<string, string>;

export interface RecvdSlice {
    policies: PolicySpecification;
    entities: Array<EntityJson>;
    templates?: Record<string, string> | null;
    template_instantiations: TemplateLink[] | null;
}

export type Links = Link[];

export interface TemplateLink {
    template_id: string;
    result_policy_id: string;
    instantiations: Links;
}

export interface Link {
    slot: string;
    value: EntityUIDStrings;
}

export interface EntityUIDStrings {
    ty: string;
    eid: string;
}

export interface AuthorizationCall {
    principal: string|{type: string, id: string};
    action: string|{type: string, id: string};
    resource: string|{type: string, id: string};
    context?: Record<string, any>;
    schema: Schema;
    enable_request_validation?: boolean;
    slice: RecvdSlice;
}

export type AuthorizationAnswer = { errors: string[] } | { response: InterfaceResponse };

export interface InterfaceDiagnostics {
    reason: Set<String>;
    errors: string[];
}

export interface InterfaceResponse {
    decision: Decision;
    diagnostics: InterfaceDiagnostics;
}

export type SchemaTypeVariant = { type: "String" } | { type: "Long" } | { type: "Boolean" } | { type: "Set"; element: SchemaType } | { type: "Record"; attributes: Record<SmolStr, TypeOfAttribute>; additionalAttributes: boolean } | { type: "Entity"; name: SmolStr } | { type: "Extension"; name: SmolStr };

export type SchemaType = SchemaTypeVariant | { type: SmolStr };

export interface ActionEntityUID {
    id: SmolStr;
    type?: SmolStr | null;
}

export interface ApplySpec {
    resourceTypes?: SmolStr[] | null;
    principalTypes?: SmolStr[] | null;
    context?: AttributesOrContext;
}

export interface ActionType {
    attributes?: Record<SmolStr, CedarValueJson> | null;
    appliesTo?: ApplySpec | null;
    memberOf?: ActionEntityUID[] | null;
}

export type AttributesOrContext = SchemaType;

export interface EntityType {
    memberOfTypes?: SmolStr[];
    shape?: AttributesOrContext;
}

export interface NamespaceDefinition {
    commonTypes?: Record<SmolStr, SchemaType>;
    entityTypes: Record<SmolStr, EntityType>;
    actions: Record<SmolStr, ActionType>;
}

export type Schema = Record<SmolStr, NamespaceDefinition>;

export type Clause = { kind: "when"; body: Expr } | { kind: "unless"; body: Expr };

export interface Policy {
    effect: Effect;
    principal: PrincipalConstraint;
    action: ActionConstraint;
    resource: ResourceConstraint;
    conditions: Clause[];
    annotations?: Record<string, string>;
}

export type EntityUidJson = { __expr: string } | { __entity: TypeAndId } | TypeAndId;

export interface FnAndArg {
    fn: string;
    arg: CedarValueJson;
}

export interface TypeAndId {
    type: string;
    id: string;
}

export type CedarValueJson = { __expr: string } | { __entity: TypeAndId } | { __extn: FnAndArg } | boolean | number | string | CedarValueJson[] | { [key: string]: CedarValueJson };

export type Effect = "permit" | "forbid";

export type Var = "principal" | "action" | "resource" | "context";

export interface EntityJson {
    uid: EntityUidJson;
    attrs: Record<string, any>;
    parents: EntityUidJson[];
}

export type ExtFuncCall = {} & Record<string, Array<Expr>>;

export type ExprNoExt = { Value: CedarValueJson } | { Var: Var } | { Slot: string } | { Unknown: { name: string } } | { "!": { arg: Expr } } | { neg: { arg: Expr } } | { "==": { left: Expr; right: Expr } } | { "!=": { left: Expr; right: Expr } } | { in: { left: Expr; right: Expr } } | { "<": { left: Expr; right: Expr } } | { "<=": { left: Expr; right: Expr } } | { ">": { left: Expr; right: Expr } } | { ">=": { left: Expr; right: Expr } } | { "&&": { left: Expr; right: Expr } } | { "||": { left: Expr; right: Expr } } | { "+": { left: Expr; right: Expr } } | { "-": { left: Expr; right: Expr } } | { "*": { left: Expr; right: Expr } } | { contains: { left: Expr; right: Expr } } | { containsAll: { left: Expr; right: Expr } } | { containsAny: { left: Expr; right: Expr } } | { ".": { left: Expr; attr: SmolStr } } | { has: { left: Expr; attr: SmolStr } } | { like: { left: Expr; pattern: SmolStr } } | { is: { left: Expr; entity_type: SmolStr; in?: Expr } } | { "if-then-else": { if: Expr; then: Expr; else: Expr } } | { Set: Expr[] } | { Record: Record<string, Expr> };

export type Expr = ExprNoExt | ExtFuncCall;

export type ActionInConstraint = { entity: EntityUidJson } | { entities: EntityUidJson[] };

export interface PrincipalOrResourceIsConstraint {
    entity_type: string;
    in?: PrincipalOrResourceInConstraint;
}

export type PrincipalOrResourceInConstraint = { entity: EntityUidJson } | { slot: string };

export type EqConstraint = { entity: EntityUidJson } | { slot: string };

export type ResourceConstraint = { op: "All" } | ({ op: "==" } & EqConstraint) | ({ op: "in" } & PrincipalOrResourceInConstraint) | ({ op: "is" } & PrincipalOrResourceIsConstraint);

export type ActionConstraint = { op: "All" } | ({ op: "==" } & EqConstraint) | ({ op: "in" } & ActionInConstraint);

export type PrincipalConstraint = { op: "All" } | ({ op: "==" } & EqConstraint) | ({ op: "in" } & PrincipalOrResourceInConstraint) | ({ op: "is" } & PrincipalOrResourceIsConstraint);

export type Decision = "Allow" | "Deny";

/**
*/
export class Template {
  free(): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly policyTextFromJson: (a: number, b: number) => number;
  readonly policyTextToJson: (a: number, b: number) => number;
  readonly checkParsePolicySet: (a: number, b: number) => number;
  readonly __wbg_template_free: (a: number) => void;
  readonly isAuthorized: (a: number, b: number) => number;
  readonly validate: (a: number, b: number) => number;
  readonly getCedarVersion: (a: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
type SmolStr = string;
export type TypeOfAttribute = SchemaType & { required?: boolean };
