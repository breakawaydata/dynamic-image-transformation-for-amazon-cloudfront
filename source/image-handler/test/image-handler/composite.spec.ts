// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { mockAwsS3 } from "../mock";

import Rekognition from "aws-sdk/clients/rekognition";
import S3 from "aws-sdk/clients/s3";
import sharp from "sharp";

import { ImageHandler } from "../../image-handler";
import { ImageEdits, StatusCodes, ImageRequestInfo, RequestTypes } from "../../lib";

const s3Client = new S3();
const rekognitionClient = new Rekognition();

describe("composite", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.SOURCE_BUCKETS = "validBucket, sourceBucket, bucket, sample-bucket";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should pass if an edit with composite greater then original image width/height", async () => {
    // Arrange
    const originalImage = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64"
    );
    const image = sharp(originalImage, { failOnError: false }).withMetadata();

    const svg = "<svg width=\"400\" height=\"400\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">" +
    "  <defs>" +
    "      <linearGradient id=\"Gradient2\" x1=\"1\" x2=\"0\" y1=\"0\" y2=\"0\">" +
    "        <stop offset=\"0%\" stop-color=\"white\" stop-opacity=\"50\"/>" +
    "        <stop offset=\"50%\" stop-color=\"white\" stop-opacity=\"0\"/>" +
    "      </linearGradient>" +
    "  </defs>" +
    "<rect x=\"0\" y=\"0\" width=\"400\" height=\"400\" fill=\"url(#Gradient2)\"/>" +
    "</svg>";
    const edits: ImageEdits = {
      composite: [ { input: svg }],
    };

    // Act
    const imageHandler = new ImageHandler(s3Client, rekognitionClient);
    const result = await imageHandler.applyEdits(image, edits, false);

    const resultBuffer = await result.toBuffer();
    expect(resultBuffer).not.toEqual(originalImage);
  });

  it("Should pass if an edit with composite with bucket and key", async () => {
    // Arrange
    const originalImage = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64"
    );
    const image = sharp(originalImage, { failOnError: false }).withMetadata();

    const svg = "<svg width=\"1\" height=\"1\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">" +
    "  <defs>" +
    "      <linearGradient id=\"Gradient2\" x1=\"1\" x2=\"0\" y1=\"0\" y2=\"0\">" +
    "        <stop offset=\"0%\" stop-color=\"white\" stop-opacity=\"50\"/>" +
    "        <stop offset=\"50%\" stop-color=\"white\" stop-opacity=\"0\"/>" +
    "      </linearGradient>" +
    "  </defs>" +
    "<rect x=\"0\" y=\"0\" width=\"1\" height=\"1\" fill=\"url(#Gradient2)\"/>" +
    "</svg>";
    const edits: ImageEdits = {
      composite: [ { bucket: 'bucket', key: 'key' }],
    };

    // Mock
    mockAwsS3.getObject.mockImplementationOnce(() => ({
      promise() {
        return Promise.resolve({
          Body: Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
            "base64"
          ),
        });
      },
    }));

    // Act
    const imageHandler = new ImageHandler(s3Client, rekognitionClient);
    const result = await imageHandler.applyEdits(image, edits, false);

    expect(mockAwsS3.getObject).toHaveBeenCalledWith({
      Bucket: "bucket",
      Key: "key",
    });

    const resultBuffer = await result.toBuffer();
    expect(resultBuffer).not.toEqual(originalImage);
  });

  it("Should pass if an edit with composite same width and height", async () => {
    // Arrange
    const originalImage = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64"
    );
    const image = sharp(originalImage, { failOnError: false }).withMetadata();

    const svg = "<svg width=\"1\" height=\"1\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">" +
    "  <defs>" +
    "      <linearGradient id=\"Gradient2\" x1=\"1\" x2=\"0\" y1=\"0\" y2=\"0\">" +
    "        <stop offset=\"0%\" stop-color=\"white\" stop-opacity=\"50\"/>" +
    "        <stop offset=\"50%\" stop-color=\"white\" stop-opacity=\"0\"/>" +
    "      </linearGradient>" +
    "  </defs>" +
    "<rect x=\"0\" y=\"0\" width=\"1\" height=\"1\" fill=\"url(#Gradient2)\"/>" +
    "</svg>";
    const edits: ImageEdits = {
      composite: [ { input: svg }],
    };

    // Mock
    mockAwsS3.getObject.mockImplementationOnce(() => ({
      promise() {
        return Promise.resolve({
          Body: Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
            "base64"
          ),
        });
      },
    }));

    // Act
    const imageHandler = new ImageHandler(s3Client, rekognitionClient);
    const result = await imageHandler.applyEdits(image, edits, false);

    const resultBuffer = await result.toBuffer();
    expect(resultBuffer).not.toEqual(originalImage);
  });
});
