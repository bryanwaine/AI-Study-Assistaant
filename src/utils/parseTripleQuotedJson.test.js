import { describe, it, expect } from "vitest";
import parseTripleQuotedJson from "./parseTripleQuotedJson";

describe("parseTripleQuotedJson", () => {
  it("parses valid JSON wrapped in triple quotes", () => {
    const input = "'''json\n{\"name\": \"Ada\"}\n'''";
    expect(parseTripleQuotedJson(input)).toEqual({ name: "Ada" });
  });

  it("parses JSON with surrounding narrative text", () => {
    const input = "Here is your result:\n'''json\n{\"a\": 1, \"b\": [1,2,3]}\n'''\nHope that helps!";
    expect(parseTripleQuotedJson(input)).toEqual({ a: 1, b: [1, 2, 3] });
  });

  it("parses arrays as the top-level JSON value", () => {
    const input = "'''json\n[1, 2, 3]\n'''";
    expect(parseTripleQuotedJson(input)).toEqual([1, 2, 3]);
  });

  it("throws when the triple-quote delimiters are missing", () => {
    expect(() => parseTripleQuotedJson("{\"name\": \"Ada\"}")).toThrow(
      "Could not find JSON content between '''json and '''"
    );
  });

  it("throws a descriptive error when the JSON content is malformed", () => {
    const input = "'''json\n{invalid json}\n'''";
    expect(() => parseTripleQuotedJson(input)).toThrow(/Invalid JSON format/);
  });
});
