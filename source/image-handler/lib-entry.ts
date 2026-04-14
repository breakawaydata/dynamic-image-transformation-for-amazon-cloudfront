// Library entry point for @breakawaydata/dynamic-image-transformation.
// Exposes the Sharp pipeline + request parser as ordinary classes so non-Lambda
// consumers (e.g. the local-dev image server in breakaway-monorepo) can reuse
// the same code that the production Lambda runs.
//
// The Lambda handler itself lives in ./index.ts and is excluded from this
// package build — it imports from ../solution-utils which belongs to the
// deployment, not the library. Consumers wire their own S3/Rekognition/Secrets
// clients and pass events directly to ImageRequest.setup().

export { ImageHandler } from "./image-handler";
export { ImageRequest, getAllowedSourceBuckets } from "./image-request";
export { SecretProvider } from "./secret-provider";
export { ThumborMapper } from "./thumbor-mapper";
export { QueryParamMapper } from "./query-param-mapper";

export * from "./lib";
