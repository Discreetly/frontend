import { RLNProver } from 'rlnjs';

const wasmPath = '/rln/circuit.wasm';
const zkeyPath = '/rln/final.zkey';
const prover: RLNProver = new RLNProver(wasmPath, zkeyPath);
export default prover;
