import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ===== STANDARD LIBRARY DOCUMENTATION =====
interface MethodData {
  name: string;
  category?: string;
  params: string;
  returns: string;
  description: string;
}

interface ExampleData {
  title?: string;
  code: string;
  filename?: string;
  showLines?: boolean;
}

interface ClassData {
  slug: string;
  name: string;
  description: string;
  constraints?: string;
  methods: MethodData[];
  examples: ExampleData[];
}

interface ModuleData {
  slug: string;
  name: string;
  description: string;
  importPath: string;
  classes: ClassData[];
}

const stdlibModules: ModuleData[] = [
  // ===== CORE MODULE =====
  {
    slug: "core",
    name: "Core",
    description: "Fundamental types including Integer, String, Bool, Float, and Double.",
    importPath: "Language::Core",
    classes: [
      {
        slug: "integer",
        name: "Integer",
        description: "64-bit signed integer type with arithmetic and comparison operations.",
        methods: [
          { name: "Constructor", params: "", returns: "Integer^", description: "Create integer with value 0" },
          { name: "Constructor", params: "value: int64", returns: "Integer^", description: "Create from literal" },
          { name: "add", params: "other: Integer^", returns: "Integer^", description: "Addition" },
          { name: "subtract", params: "other: Integer^", returns: "Integer^", description: "Subtraction" },
          { name: "multiply", params: "other: Integer^", returns: "Integer^", description: "Multiplication" },
          { name: "divide", params: "other: Integer^", returns: "Integer^", description: "Integer division" },
          { name: "modulo", params: "other: Integer^", returns: "Integer^", description: "Remainder" },
          { name: "negate", params: "", returns: "Integer^", description: "Negation (-n)" },
          { name: "abs", params: "", returns: "Integer^", description: "Absolute value" },
          { name: "equals", params: "other: Integer^", returns: "Bool^", description: "Equality check" },
          { name: "lessThan", params: "other: Integer^", returns: "Bool^", description: "Less than" },
          { name: "greaterThan", params: "other: Integer^", returns: "Bool^", description: "Greater than" },
          { name: "lessThanOrEqual", params: "other: Integer^", returns: "Bool^", description: "Less or equal" },
          { name: "greaterThanOrEqual", params: "other: Integer^", returns: "Bool^", description: "Greater or equal" },
          { name: "toString", params: "", returns: "String^", description: "Convert to string" },
          { name: "toFloat", params: "", returns: "Float^", description: "Convert to Float" },
          { name: "toDouble", params: "", returns: "Double^", description: "Convert to Double" },
          { name: "toInt64", params: "", returns: "int64", description: "Get raw value" },
        ],
        examples: [
          {
            title: "Basic Integer Operations",
            code: `Instantiate Integer^ As <a> = Integer::Constructor(10);
Instantiate Integer^ As <b> = Integer::Constructor(3);

Instantiate Integer^ As <sum> = a.add(b);        // 13
Instantiate Integer^ As <diff> = a.subtract(b);  // 7
Instantiate Integer^ As <prod> = a.multiply(b);  // 30
Instantiate Integer^ As <quot> = a.divide(b);    // 3
Instantiate Integer^ As <rem> = a.modulo(b);     // 1`,
          },
        ],
      },
      {
        slug: "string",
        name: "String",
        description: "Immutable UTF-8 string type with text manipulation methods.",
        methods: [
          { name: "Constructor", params: "", returns: "String^", description: "Create empty string" },
          { name: "Constructor", params: "literal: string", returns: "String^", description: "Create from literal" },
          { name: "length", params: "", returns: "Integer^", description: "Character count" },
          { name: "charAt", params: "index: Integer^", returns: "String^", description: "Get character at index" },
          { name: "append", params: "other: String^", returns: "String^", description: "Concatenate strings" },
          { name: "substring", params: "start: Integer^, end: Integer^", returns: "String^", description: "Extract substring" },
          { name: "indexOf", params: "substr: String^", returns: "Integer^", description: "Find substring (-1 if not found)" },
          { name: "contains", params: "substr: String^", returns: "Bool^", description: "Check if contains" },
          { name: "startsWith", params: "prefix: String^", returns: "Bool^", description: "Check prefix" },
          { name: "endsWith", params: "suffix: String^", returns: "Bool^", description: "Check suffix" },
          { name: "toUpperCase", params: "", returns: "String^", description: "Convert to uppercase" },
          { name: "toLowerCase", params: "", returns: "String^", description: "Convert to lowercase" },
          { name: "trim", params: "", returns: "String^", description: "Remove whitespace" },
          { name: "replace", params: "old: String^, new: String^", returns: "String^", description: "Replace occurrences" },
          { name: "split", params: "delimiter: String^", returns: "List<String>^", description: "Split into list" },
          { name: "equals", params: "other: String^", returns: "Bool^", description: "Equality check" },
          { name: "isEmpty", params: "", returns: "Bool^", description: "Check if empty" },
          { name: "toInteger", params: "", returns: "Integer^", description: "Parse as integer" },
        ],
        examples: [
          {
            title: "String Manipulation",
            code: `Instantiate String^ As <greeting> = String::Constructor("Hello, World!");
Instantiate Integer^ As <len> = greeting.length();  // 13

Instantiate String^ As <upper> = greeting.toUpperCase();  // "HELLO, WORLD!"
Instantiate String^ As <sub> = greeting.substring(Integer::Constructor(0), Integer::Constructor(5));  // "Hello"

Instantiate Bool^ As <hasWorld> = greeting.contains(String::Constructor("World"));  // true`,
          },
        ],
      },
      {
        slug: "bool",
        name: "Bool",
        description: "Boolean type representing true or false values.",
        methods: [
          { name: "Constructor", params: "", returns: "Bool^", description: "Create Bool (false)" },
          { name: "Constructor", params: "value: bool", returns: "Bool^", description: "Create from literal" },
          { name: "and", params: "other: Bool^", returns: "Bool^", description: "Logical AND" },
          { name: "or", params: "other: Bool^", returns: "Bool^", description: "Logical OR" },
          { name: "not", params: "", returns: "Bool^", description: "Logical NOT" },
          { name: "equals", params: "other: Bool^", returns: "Bool^", description: "Equality check" },
          { name: "toString", params: "", returns: "String^", description: "\"true\" or \"false\"" },
          { name: "toBool", params: "", returns: "bool", description: "Get raw value" },
        ],
        examples: [
          {
            title: "Boolean Operations",
            code: `Instantiate Bool^ As <a> = Bool::Constructor(true);
Instantiate Bool^ As <b> = Bool::Constructor(false);

Instantiate Bool^ As <andResult> = a.and(b);  // false
Instantiate Bool^ As <orResult> = a.or(b);    // true
Instantiate Bool^ As <notResult> = a.not();   // false`,
          },
        ],
      },
      {
        slug: "float",
        name: "Float",
        description: "32-bit floating-point number.",
        methods: [
          { name: "Constructor", params: "", returns: "Float^", description: "Create Float (0.0)" },
          { name: "Constructor", params: "value: float", returns: "Float^", description: "Create from literal" },
          { name: "add", params: "other: Float^", returns: "Float^", description: "Addition" },
          { name: "subtract", params: "other: Float^", returns: "Float^", description: "Subtraction" },
          { name: "multiply", params: "other: Float^", returns: "Float^", description: "Multiplication" },
          { name: "divide", params: "other: Float^", returns: "Float^", description: "Division" },
          { name: "equals", params: "other: Float^", returns: "Bool^", description: "Equality check" },
          { name: "lessThan", params: "other: Float^", returns: "Bool^", description: "Less than" },
          { name: "greaterThan", params: "other: Float^", returns: "Bool^", description: "Greater than" },
          { name: "toString", params: "", returns: "String^", description: "Convert to string" },
          { name: "toInteger", params: "", returns: "Integer^", description: "Truncate to Integer" },
          { name: "toDouble", params: "", returns: "Double^", description: "Convert to Double" },
        ],
        examples: [
          {
            title: "Float Operations",
            code: `Instantiate Float^ As <pi> = Float::Constructor(3.14159f);
Instantiate Float^ As <radius> = Float::Constructor(2.5f);
Instantiate Float^ As <area> = pi.multiply(radius).multiply(radius);`,
          },
        ],
      },
      {
        slug: "double",
        name: "Double",
        description: "64-bit double-precision floating-point number.",
        methods: [
          { name: "Constructor", params: "", returns: "Double^", description: "Create Double (0.0)" },
          { name: "Constructor", params: "value: double", returns: "Double^", description: "Create from literal" },
          { name: "add", params: "other: Double^", returns: "Double^", description: "Addition" },
          { name: "subtract", params: "other: Double^", returns: "Double^", description: "Subtraction" },
          { name: "multiply", params: "other: Double^", returns: "Double^", description: "Multiplication" },
          { name: "divide", params: "other: Double^", returns: "Double^", description: "Division" },
          { name: "equals", params: "other: Double^", returns: "Bool^", description: "Equality check" },
          { name: "lessThan", params: "other: Double^", returns: "Bool^", description: "Less than" },
          { name: "greaterThan", params: "other: Double^", returns: "Bool^", description: "Greater than" },
          { name: "toString", params: "", returns: "String^", description: "Convert to string" },
          { name: "toInteger", params: "", returns: "Integer^", description: "Truncate to Integer" },
          { name: "toFloat", params: "", returns: "Float^", description: "Convert to Float (may lose precision)" },
        ],
        examples: [
          {
            title: "Double Precision",
            code: `Instantiate Double^ As <precise> = Double::Constructor(3.141592653589793);
Instantiate Double^ As <result> = precise.multiply(Double::Constructor(2.0));`,
          },
        ],
      },
    ],
  },
  // ===== COLLECTIONS MODULE =====
  {
    slug: "collections",
    name: "Collections",
    description: "Generic collection types including List, HashMap, Set, Array, Stack, and Queue.",
    importPath: "Language::Collections",
    classes: [
      {
        slug: "list",
        name: "List<T>",
        description: "Dynamic array with automatic resizing. Supports random access and iteration.",
        constraints: "T Constrains None",
        methods: [
          { name: "Constructor", params: "", returns: "List<T>^", description: "Create empty list" },
          { name: "add", params: "element: T^", returns: "None", description: "Add to end" },
          { name: "get", params: "index: Integer^", returns: "T^", description: "Get at index" },
          { name: "set", params: "index: Integer^, element: T^", returns: "None", description: "Set at index" },
          { name: "remove", params: "index: Integer^", returns: "None", description: "Remove at index" },
          { name: "size", params: "", returns: "Integer^", description: "Element count" },
          { name: "isEmpty", params: "", returns: "Bool^", description: "Check if empty" },
          { name: "clear", params: "", returns: "None", description: "Remove all elements" },
          { name: "contains", params: "element: T^", returns: "Bool^", description: "Check if contains" },
          { name: "indexOf", params: "element: T^", returns: "Integer^", description: "Find index (-1 if not found)" },
          { name: "begin", params: "", returns: "ListIterator<T>^", description: "Get iterator" },
        ],
        examples: [
          {
            title: "List Operations",
            code: `Instantiate Collections::List<Integer>^ As <numbers> = Collections::List@Integer::Constructor();
Run numbers.add(Integer::Constructor(10));
Run numbers.add(Integer::Constructor(20));
Run numbers.add(Integer::Constructor(30));

Instantiate Integer^ As <first> = numbers.get(Integer::Constructor(0));  // 10
Instantiate Integer^ As <count> = numbers.size();  // 3`,
          },
        ],
      },
      {
        slug: "hashmap",
        name: "HashMap<K, V>",
        description: "Hash-based key-value store with O(1) average lookup.",
        constraints: "K Constrains Hashable, V Constrains None",
        methods: [
          { name: "Constructor", params: "", returns: "HashMap<K,V>^", description: "Create empty map" },
          { name: "put", params: "key: K^, value: V^", returns: "None", description: "Insert or update" },
          { name: "get", params: "key: K^", returns: "V^", description: "Get value by key" },
          { name: "remove", params: "key: K^", returns: "Bool^", description: "Remove key-value pair" },
          { name: "containsKey", params: "key: K^", returns: "Bool^", description: "Check if key exists" },
          { name: "size", params: "", returns: "Integer^", description: "Number of pairs" },
          { name: "isEmpty", params: "", returns: "Bool^", description: "Check if empty" },
          { name: "clear", params: "", returns: "None", description: "Remove all pairs" },
          { name: "keys", params: "", returns: "List<K>^", description: "Get all keys" },
          { name: "values", params: "", returns: "List<V>^", description: "Get all values" },
          { name: "begin", params: "", returns: "HashMapIterator<K,V>^", description: "Get iterator" },
        ],
        examples: [
          {
            title: "HashMap Usage",
            code: `Instantiate Collections::HashMap<String, Integer>^ As <ages> =
    Collections::HashMap@String, Integer::Constructor();

Run ages.put(String::Constructor("Alice"), Integer::Constructor(30));
Run ages.put(String::Constructor("Bob"), Integer::Constructor(25));

Instantiate Integer^ As <aliceAge> = ages.get(String::Constructor("Alice"));  // 30`,
          },
        ],
      },
      {
        slug: "set",
        name: "Set<T>",
        description: "Unordered collection of unique elements.",
        constraints: "T Constrains Hashable",
        methods: [
          { name: "Constructor", params: "", returns: "Set<T>^", description: "Create empty set" },
          { name: "add", params: "element: T^", returns: "Bool^", description: "Add element (false if exists)" },
          { name: "remove", params: "element: T^", returns: "Bool^", description: "Remove element" },
          { name: "contains", params: "element: T^", returns: "Bool^", description: "Check membership" },
          { name: "size", params: "", returns: "Integer^", description: "Element count" },
          { name: "isEmpty", params: "", returns: "Bool^", description: "Check if empty" },
          { name: "clear", params: "", returns: "None", description: "Remove all elements" },
          { name: "union", params: "other: Set<T>^", returns: "Set<T>^", description: "Set union" },
          { name: "intersection", params: "other: Set<T>^", returns: "Set<T>^", description: "Set intersection" },
          { name: "difference", params: "other: Set<T>^", returns: "Set<T>^", description: "Set difference" },
          { name: "begin", params: "", returns: "SetIterator<T>^", description: "Get iterator" },
        ],
        examples: [
          {
            title: "Set Operations",
            code: `Instantiate Collections::Set<String>^ As <tags> = Collections::Set@String::Constructor();
Run tags.add(String::Constructor("xxml"));
Run tags.add(String::Constructor("programming"));
Run tags.add(String::Constructor("xxml"));  // Returns false, already exists

Instantiate Integer^ As <count> = tags.size();  // 2`,
          },
        ],
      },
      {
        slug: "array",
        name: "Array<T>",
        description: "Fixed-size array allocated at construction time.",
        constraints: "T Constrains None",
        methods: [
          { name: "Constructor", params: "size: Integer^", returns: "Array<T>^", description: "Create array of size" },
          { name: "get", params: "index: Integer^", returns: "T^", description: "Get at index" },
          { name: "set", params: "index: Integer^, element: T^", returns: "None", description: "Set at index" },
          { name: "size", params: "", returns: "Integer^", description: "Array size" },
          { name: "fill", params: "value: T^", returns: "None", description: "Fill all elements" },
        ],
        examples: [
          {
            title: "Fixed Array",
            code: `Instantiate Collections::Array<Integer>^ As <arr> =
    Collections::Array@Integer::Constructor(Integer::Constructor(5));

Run arr.set(Integer::Constructor(0), Integer::Constructor(100));
Instantiate Integer^ As <first> = arr.get(Integer::Constructor(0));  // 100`,
          },
        ],
      },
      {
        slug: "stack",
        name: "Stack<T>",
        description: "Last-in-first-out (LIFO) data structure.",
        constraints: "T Constrains None",
        methods: [
          { name: "Constructor", params: "", returns: "Stack<T>^", description: "Create empty stack" },
          { name: "push", params: "element: T^", returns: "None", description: "Push onto top" },
          { name: "pop", params: "", returns: "T^", description: "Remove and return top" },
          { name: "peek", params: "", returns: "T^", description: "View top without removing" },
          { name: "size", params: "", returns: "Integer^", description: "Element count" },
          { name: "isEmpty", params: "", returns: "Bool^", description: "Check if empty" },
          { name: "clear", params: "", returns: "None", description: "Remove all elements" },
        ],
        examples: [
          {
            title: "Stack Usage",
            code: `Instantiate Collections::Stack<String>^ As <history> = Collections::Stack@String::Constructor();
Run history.push(String::Constructor("page1"));
Run history.push(String::Constructor("page2"));

Instantiate String^ As <current> = history.pop();  // "page2"`,
          },
        ],
      },
      {
        slug: "queue",
        name: "Queue<T>",
        description: "First-in-first-out (FIFO) data structure.",
        constraints: "T Constrains None",
        methods: [
          { name: "Constructor", params: "", returns: "Queue<T>^", description: "Create empty queue" },
          { name: "enqueue", params: "element: T^", returns: "None", description: "Add to back" },
          { name: "dequeue", params: "", returns: "T^", description: "Remove from front" },
          { name: "peek", params: "", returns: "T^", description: "View front without removing" },
          { name: "size", params: "", returns: "Integer^", description: "Element count" },
          { name: "isEmpty", params: "", returns: "Bool^", description: "Check if empty" },
          { name: "clear", params: "", returns: "None", description: "Remove all elements" },
        ],
        examples: [
          {
            title: "Queue Usage",
            code: `Instantiate Collections::Queue<String>^ As <tasks> = Collections::Queue@String::Constructor();
Run tasks.enqueue(String::Constructor("task1"));
Run tasks.enqueue(String::Constructor("task2"));

Instantiate String^ As <next> = tasks.dequeue();  // "task1"`,
          },
        ],
      },
    ],
  },
  // ===== ITERATORS MODULE =====
  {
    slug: "iterators",
    name: "Iterators",
    description: "Iterator types for traversing collections with forward, bidirectional, and random access capabilities.",
    importPath: "Language::Collections",
    classes: [
      {
        slug: "listiterator",
        name: "ListIterator<T>",
        description: "Random access iterator for List. Supports forward, backward, and index-based traversal.",
        methods: [
          { name: "hasNext", category: "Forward Iteration", params: "", returns: "Bool^", description: "More elements ahead" },
          { name: "next", category: "Forward Iteration", params: "", returns: "T^", description: "Advance and return element" },
          { name: "current", category: "Forward Iteration", params: "", returns: "T^", description: "Current element (no advance)" },
          { name: "hasPrevious", category: "Backward Iteration", params: "", returns: "Bool^", description: "More elements behind" },
          { name: "previous", category: "Backward Iteration", params: "", returns: "T^", description: "Move back and return element" },
          { name: "advance", category: "Random Access", params: "n: Integer^", returns: "None", description: "Move n positions forward" },
          { name: "at", category: "Random Access", params: "idx: Integer^", returns: "T^", description: "Get element at absolute index" },
          { name: "index", category: "Random Access", params: "", returns: "Integer^", description: "Current position" },
          { name: "reset", category: "Utility", params: "", returns: "None", description: "Return to beginning" },
          { name: "toEnd", category: "Utility", params: "", returns: "None", description: "Move to end" },
          { name: "equals", category: "Utility", params: "other: ListIterator<T>^", returns: "Bool^", description: "Compare positions" },
          { name: "distance", category: "Utility", params: "other: ListIterator<T>^", returns: "Integer^", description: "Elements between iterators" },
        ],
        examples: [
          {
            title: "List Iteration",
            code: `Instantiate Collections::List<Integer>^ As <nums> = Collections::List@Integer::Constructor();
Run nums.add(Integer::Constructor(10));
Run nums.add(Integer::Constructor(20));
Run nums.add(Integer::Constructor(30));

Instantiate Collections::ListIterator<Integer>^ As <iter> = nums.begin();

// Forward iteration
While (iter.hasNext()) -> {
    Run Console::printLine(iter.next().toString());
}
// Output: 10, 20, 30`,
          },
        ],
      },
      {
        slug: "setiterator",
        name: "SetIterator<T>",
        description: "Forward iterator for Set.",
        methods: [
          { name: "hasNext", params: "", returns: "Bool^", description: "More elements available" },
          { name: "next", params: "", returns: "T^", description: "Advance and return element" },
          { name: "current", params: "", returns: "T^", description: "Current element" },
          { name: "reset", params: "", returns: "None", description: "Return to beginning" },
        ],
        examples: [
          {
            title: "Set Iteration",
            code: `Instantiate Collections::Set<String>^ As <tags> = Collections::Set@String::Constructor();
Run tags.add(String::Constructor("a"));
Run tags.add(String::Constructor("b"));

Instantiate Collections::SetIterator<String>^ As <iter> = tags.begin();
While (iter.hasNext()) -> {
    Run Console::printLine(iter.next());
}`,
          },
        ],
      },
      {
        slug: "hashmapiterator",
        name: "HashMapIterator<K, V>",
        description: "Forward iterator for HashMap, yields key-value pairs.",
        methods: [
          { name: "hasNext", params: "", returns: "Bool^", description: "More entries available" },
          { name: "next", params: "", returns: "KeyValuePair<K,V>^", description: "Advance and return entry" },
          { name: "current", params: "", returns: "KeyValuePair<K,V>^", description: "Current entry" },
          { name: "currentKey", params: "", returns: "K&", description: "Reference to current key" },
          { name: "currentValue", params: "", returns: "V&", description: "Reference to current value" },
          { name: "reset", params: "", returns: "None", description: "Return to beginning" },
        ],
        examples: [
          {
            title: "HashMap Iteration",
            code: `Instantiate Collections::HashMap<String, Integer>^ As <scores> =
    Collections::HashMap@String, Integer::Constructor();
Run scores.put(String::Constructor("Alice"), Integer::Constructor(95));
Run scores.put(String::Constructor("Bob"), Integer::Constructor(87));

Instantiate Collections::HashMapIterator<String, Integer>^ As <iter> = scores.begin();
While (iter.hasNext()) -> {
    Instantiate Collections::KeyValuePair<String, Integer>^ As <entry> = iter.next();
    Run Console::printLine(entry.key().append(String::Constructor(": ")).append(entry.value().toString()));
}`,
          },
        ],
      },
      {
        slug: "keyvaluepair",
        name: "KeyValuePair<K, V>",
        description: "Non-owning view of a key-value pair from HashMap iteration.",
        methods: [
          { name: "Constructor", params: "", returns: "KeyValuePair<K,V>^", description: "Empty pair" },
          { name: "Constructor", params: "k: K^, v: V^", returns: "KeyValuePair<K,V>^", description: "Pair with key and value" },
          { name: "key", params: "", returns: "K&", description: "Reference to key" },
          { name: "value", params: "", returns: "V&", description: "Reference to value" },
          { name: "toString", params: "", returns: "String^", description: "(key, value) format" },
        ],
        examples: [],
      },
    ],
  },
  // ===== CONSOLE MODULE =====
  {
    slug: "console",
    name: "Console",
    description: "Console input/output operations for terminal interaction.",
    importPath: "Language::System",
    classes: [
      {
        slug: "console",
        name: "Console",
        description: "Static methods for reading from stdin and writing to stdout/stderr.",
        methods: [
          { name: "print", category: "Output", params: "text: String^", returns: "None", description: "Print text (no newline)" },
          { name: "printLine", category: "Output", params: "text: String^", returns: "None", description: "Print text with newline" },
          { name: "printError", category: "Output", params: "text: String^", returns: "None", description: "Print to stderr" },
          { name: "readLine", category: "Input", params: "", returns: "String^", description: "Read line from stdin" },
          { name: "readChar", category: "Input", params: "", returns: "String^", description: "Read single character" },
          { name: "clear", category: "Control", params: "", returns: "None", description: "Clear console screen" },
        ],
        examples: [
          {
            title: "Console I/O",
            code: `Run Console::printLine(String::Constructor("What is your name?"));
Instantiate String^ As <name> = Console::readLine();
Run Console::printLine(String::Constructor("Hello, ").append(name).append(String::Constructor("!")));`,
          },
          {
            title: "Error Output",
            code: `Run Console::printError(String::Constructor("Error: File not found"));`,
          },
        ],
      },
    ],
  },
  // ===== FILE I/O MODULE =====
  {
    slug: "file-io",
    name: "File I/O",
    description: "File operations for reading and writing files.",
    importPath: "Language::IO",
    classes: [
      {
        slug: "file",
        name: "File",
        description: "File operations with both static utility methods and instance-based operations.",
        methods: [
          { name: "exists", category: "Static Methods", params: "path: String^", returns: "Bool^", description: "True if file exists" },
          { name: "delete", category: "Static Methods", params: "path: String^", returns: "Bool^", description: "True if deleted" },
          { name: "copy", category: "Static Methods", params: "srcPath: String^, dstPath: String^", returns: "Bool^", description: "True if copied" },
          { name: "rename", category: "Static Methods", params: "oldPath: String^, newPath: String^", returns: "Bool^", description: "True if renamed" },
          { name: "sizeOf", category: "Static Methods", params: "path: String^", returns: "Integer^", description: "Size in bytes" },
          { name: "readAll", category: "Static Methods", params: "path: String^", returns: "String^", description: "Read entire file content" },
          { name: "Constructor", category: "Instance Methods", params: "path: String^, mode: String^", returns: "File^", description: "Open file (r/w/a mode)" },
          { name: "close", category: "Instance Methods", params: "", returns: "None", description: "Close file handle" },
          { name: "isOpen", category: "Instance Methods", params: "", returns: "Bool^", description: "True if file is open" },
          { name: "eof", category: "Instance Methods", params: "", returns: "Bool^", description: "True if at end of file" },
          { name: "size", category: "Instance Methods", params: "", returns: "Integer^", description: "Size in bytes" },
          { name: "readLine", category: "Reading", params: "", returns: "String^", description: "Read next line" },
          { name: "writeString", category: "Writing", params: "text: String^", returns: "Integer^", description: "Bytes written" },
          { name: "writeLine", category: "Writing", params: "text: String^", returns: "Integer^", description: "Bytes written (with newline)" },
          { name: "flush", category: "Writing", params: "", returns: "Integer^", description: "Flush buffered data to disk" },
        ],
        examples: [
          {
            title: "Reading a File",
            code: `If (IO::File::exists(String::Constructor("config.txt"))) -> {
    Instantiate String^ As <content> = IO::File::readAll(String::Constructor("config.txt"));
    Run Console::printLine(content);
}`,
          },
          {
            title: "Writing a File",
            code: `Instantiate IO::File^ As <out> = IO::File::Constructor(
    String::Constructor("output.txt"),
    String::Constructor("w")
);
Run out.writeLine(String::Constructor("Hello, World!"));
Run out.close();`,
          },
          {
            title: "Reading Line by Line",
            code: `Instantiate IO::File^ As <file> = IO::File::Constructor(
    String::Constructor("data.txt"),
    String::Constructor("r")
);
While (file.eof().not()) -> {
    Instantiate String^ As <line> = file.readLine();
    Run Console::printLine(line);
}
Run file.close();`,
          },
        ],
      },
    ],
  },
  // ===== TEXT MODULE =====
  {
    slug: "text",
    name: "Text",
    description: "Text utilities including StringUtils and Pattern for regex operations.",
    importPath: "Language::Text",
    classes: [
      {
        slug: "stringutils",
        name: "StringUtils",
        description: "Static utility methods for string manipulation.",
        methods: [
          { name: "join", params: "list: List<String>^, separator: String^", returns: "String^", description: "Join strings with separator" },
          { name: "repeat", params: "str: String^, count: Integer^", returns: "String^", description: "Repeat string n times" },
          { name: "padLeft", params: "str: String^, length: Integer^, char: String^", returns: "String^", description: "Pad on left to length" },
          { name: "padRight", params: "str: String^, length: Integer^, char: String^", returns: "String^", description: "Pad on right to length" },
          { name: "reverse", params: "str: String^", returns: "String^", description: "Reverse string" },
          { name: "isNumeric", params: "str: String^", returns: "Bool^", description: "Check if all digits" },
          { name: "isAlpha", params: "str: String^", returns: "Bool^", description: "Check if all letters" },
          { name: "isAlphanumeric", params: "str: String^", returns: "Bool^", description: "Check if letters/digits only" },
        ],
        examples: [
          {
            title: "String Utilities",
            code: `Instantiate Collections::List<String>^ As <parts> = Collections::List@String::Constructor();
Run parts.add(String::Constructor("a"));
Run parts.add(String::Constructor("b"));
Run parts.add(String::Constructor("c"));

Instantiate String^ As <joined> = Text::StringUtils::join(parts, String::Constructor(", "));
// Result: "a, b, c"

Instantiate String^ As <padded> = Text::StringUtils::padLeft(
    String::Constructor("42"),
    Integer::Constructor(5),
    String::Constructor("0")
);
// Result: "00042"`,
          },
        ],
      },
      {
        slug: "pattern",
        name: "Pattern",
        description: "Regular expression pattern matching.",
        methods: [
          { name: "Constructor", params: "regex: String^", returns: "Pattern^", description: "Compile regex pattern" },
          { name: "matches", params: "input: String^", returns: "Bool^", description: "Full match check" },
          { name: "find", params: "input: String^", returns: "Bool^", description: "Partial match check" },
          { name: "findAll", params: "input: String^", returns: "List<String>^", description: "All matches" },
          { name: "replace", params: "input: String^, replacement: String^", returns: "String^", description: "Replace all matches" },
          { name: "split", params: "input: String^", returns: "List<String>^", description: "Split by pattern" },
        ],
        examples: [
          {
            title: "Pattern Matching",
            code: `Instantiate Text::Pattern^ As <emailPattern> = Text::Pattern::Constructor(
    String::Constructor("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}")
);

Instantiate Bool^ As <valid> = emailPattern.matches(String::Constructor("user@example.com"));
// Result: true

Instantiate Text::Pattern^ As <digits> = Text::Pattern::Constructor(String::Constructor("\\\\d+"));
Instantiate Collections::List<String>^ As <numbers> = digits.findAll(
    String::Constructor("abc123def456")
);
// Result: ["123", "456"]`,
          },
        ],
      },
    ],
  },
  // ===== MATH MODULE =====
  {
    slug: "math",
    name: "Math",
    description: "Mathematical functions for trigonometry, exponentiation, and numeric operations.",
    importPath: "Language::Math",
    classes: [
      {
        slug: "math",
        name: "Math",
        description: "Static mathematical functions operating on Double values.",
        methods: [
          { name: "abs", category: "Basic", params: "x: Double^", returns: "Double^", description: "Absolute value" },
          { name: "min", category: "Basic", params: "a: Double^, b: Double^", returns: "Double^", description: "Minimum of two values" },
          { name: "max", category: "Basic", params: "a: Double^, b: Double^", returns: "Double^", description: "Maximum of two values" },
          { name: "floor", category: "Rounding", params: "x: Double^", returns: "Double^", description: "Round down" },
          { name: "ceil", category: "Rounding", params: "x: Double^", returns: "Double^", description: "Round up" },
          { name: "round", category: "Rounding", params: "x: Double^", returns: "Double^", description: "Round to nearest" },
          { name: "sqrt", category: "Powers", params: "x: Double^", returns: "Double^", description: "Square root" },
          { name: "pow", category: "Powers", params: "base: Double^, exp: Double^", returns: "Double^", description: "Power function" },
          { name: "exp", category: "Powers", params: "x: Double^", returns: "Double^", description: "e^x" },
          { name: "log", category: "Powers", params: "x: Double^", returns: "Double^", description: "Natural logarithm" },
          { name: "log10", category: "Powers", params: "x: Double^", returns: "Double^", description: "Base-10 logarithm" },
          { name: "sin", category: "Trigonometry", params: "x: Double^", returns: "Double^", description: "Sine (radians)" },
          { name: "cos", category: "Trigonometry", params: "x: Double^", returns: "Double^", description: "Cosine (radians)" },
          { name: "tan", category: "Trigonometry", params: "x: Double^", returns: "Double^", description: "Tangent (radians)" },
          { name: "asin", category: "Trigonometry", params: "x: Double^", returns: "Double^", description: "Arc sine" },
          { name: "acos", category: "Trigonometry", params: "x: Double^", returns: "Double^", description: "Arc cosine" },
          { name: "atan", category: "Trigonometry", params: "x: Double^", returns: "Double^", description: "Arc tangent" },
          { name: "atan2", category: "Trigonometry", params: "y: Double^, x: Double^", returns: "Double^", description: "Two-argument arc tangent" },
          { name: "PI", category: "Constants", params: "", returns: "Double^", description: "Pi constant" },
          { name: "E", category: "Constants", params: "", returns: "Double^", description: "Euler's number" },
          { name: "random", category: "Random", params: "", returns: "Double^", description: "Random [0.0, 1.0)" },
          { name: "randomInt", category: "Random", params: "min: Integer^, max: Integer^", returns: "Integer^", description: "Random integer in range" },
        ],
        examples: [
          {
            title: "Mathematical Operations",
            code: `Instantiate Double^ As <x> = Double::Constructor(2.0);
Instantiate Double^ As <y> = Double::Constructor(3.0);

Instantiate Double^ As <power> = Math::Math::pow(x, y);  // 8.0
Instantiate Double^ As <root> = Math::Math::sqrt(Double::Constructor(16.0));  // 4.0

// Trigonometry
Instantiate Double^ As <pi> = Math::Math::PI();
Instantiate Double^ As <sinPi> = Math::Math::sin(pi);  // ~0.0

// Random numbers
Instantiate Integer^ As <dice> = Math::Math::randomInt(
    Integer::Constructor(1),
    Integer::Constructor(6)
);`,
          },
        ],
      },
    ],
  },
  // ===== TIME MODULE =====
  {
    slug: "time",
    name: "Time",
    description: "Date/time handling with DateTime, TimeSpan, and Timer classes.",
    importPath: "Language::Time",
    classes: [
      {
        slug: "datetime",
        name: "DateTime",
        description: "Represents a point in time with date and time components.",
        methods: [
          { name: "now", category: "Static", params: "", returns: "DateTime^", description: "Current date/time" },
          { name: "Constructor", params: "y: Integer^, m: Integer^, d: Integer^", returns: "DateTime^", description: "From date components" },
          { name: "Constructor", params: "y: Integer^, m: Integer^, d: Integer^, h: Integer^, min: Integer^, s: Integer^", returns: "DateTime^", description: "From date and time" },
          { name: "year", params: "", returns: "Integer^", description: "Get year" },
          { name: "month", params: "", returns: "Integer^", description: "Get month (1-12)" },
          { name: "day", params: "", returns: "Integer^", description: "Get day (1-31)" },
          { name: "hour", params: "", returns: "Integer^", description: "Get hour (0-23)" },
          { name: "minute", params: "", returns: "Integer^", description: "Get minute (0-59)" },
          { name: "second", params: "", returns: "Integer^", description: "Get second (0-59)" },
          { name: "dayOfWeek", params: "", returns: "Integer^", description: "Day of week (0=Sunday)" },
          { name: "addDays", params: "days: Integer^", returns: "DateTime^", description: "Add days" },
          { name: "addHours", params: "hours: Integer^", returns: "DateTime^", description: "Add hours" },
          { name: "addMinutes", params: "minutes: Integer^", returns: "DateTime^", description: "Add minutes" },
          { name: "addSeconds", params: "seconds: Integer^", returns: "DateTime^", description: "Add seconds" },
          { name: "subtract", params: "other: DateTime^", returns: "TimeSpan^", description: "Difference as TimeSpan" },
          { name: "isBefore", params: "other: DateTime^", returns: "Bool^", description: "Comparison" },
          { name: "isAfter", params: "other: DateTime^", returns: "Bool^", description: "Comparison" },
          { name: "format", params: "pattern: String^", returns: "String^", description: "Format to string" },
          { name: "toString", params: "", returns: "String^", description: "ISO 8601 format" },
        ],
        examples: [
          {
            title: "DateTime Usage",
            code: `Instantiate Time::DateTime^ As <now> = Time::DateTime::now();
Run Console::printLine(String::Constructor("Current: ").append(now.toString()));

Instantiate Time::DateTime^ As <tomorrow> = now.addDays(Integer::Constructor(1));
Instantiate Time::DateTime^ As <birthday> = Time::DateTime::Constructor(
    Integer::Constructor(2000),
    Integer::Constructor(6),
    Integer::Constructor(15)
);`,
          },
        ],
      },
      {
        slug: "timespan",
        name: "TimeSpan",
        description: "Represents a duration of time.",
        methods: [
          { name: "Constructor", params: "days: Integer^, hours: Integer^, mins: Integer^, secs: Integer^", returns: "TimeSpan^", description: "From components" },
          { name: "fromDays", category: "Static", params: "days: Integer^", returns: "TimeSpan^", description: "Create from days" },
          { name: "fromHours", category: "Static", params: "hours: Integer^", returns: "TimeSpan^", description: "Create from hours" },
          { name: "fromMinutes", category: "Static", params: "minutes: Integer^", returns: "TimeSpan^", description: "Create from minutes" },
          { name: "fromSeconds", category: "Static", params: "seconds: Integer^", returns: "TimeSpan^", description: "Create from seconds" },
          { name: "fromMilliseconds", category: "Static", params: "ms: Integer^", returns: "TimeSpan^", description: "Create from milliseconds" },
          { name: "days", params: "", returns: "Integer^", description: "Days component" },
          { name: "hours", params: "", returns: "Integer^", description: "Hours component" },
          { name: "minutes", params: "", returns: "Integer^", description: "Minutes component" },
          { name: "seconds", params: "", returns: "Integer^", description: "Seconds component" },
          { name: "totalDays", params: "", returns: "Double^", description: "Total as days" },
          { name: "totalHours", params: "", returns: "Double^", description: "Total as hours" },
          { name: "totalMinutes", params: "", returns: "Double^", description: "Total as minutes" },
          { name: "totalSeconds", params: "", returns: "Double^", description: "Total as seconds" },
          { name: "totalMilliseconds", params: "", returns: "Double^", description: "Total as milliseconds" },
          { name: "add", params: "other: TimeSpan^", returns: "TimeSpan^", description: "Add durations" },
          { name: "subtract", params: "other: TimeSpan^", returns: "TimeSpan^", description: "Subtract durations" },
          { name: "toString", params: "", returns: "String^", description: "d.hh:mm:ss format" },
        ],
        examples: [
          {
            title: "TimeSpan Usage",
            code: `Instantiate Time::TimeSpan^ As <duration> = Time::TimeSpan::fromHours(Integer::Constructor(2));
Instantiate Time::TimeSpan^ As <extra> = Time::TimeSpan::fromMinutes(Integer::Constructor(30));
Instantiate Time::TimeSpan^ As <total> = duration.add(extra);

Run Console::printLine(total.toString());  // 0.02:30:00`,
          },
        ],
      },
      {
        slug: "timer",
        name: "Timer",
        description: "High-resolution timer for measuring elapsed time.",
        methods: [
          { name: "Constructor", params: "", returns: "Timer^", description: "Create timer (not started)" },
          { name: "start", params: "", returns: "None", description: "Start/restart timer" },
          { name: "stop", params: "", returns: "None", description: "Stop timer" },
          { name: "reset", params: "", returns: "None", description: "Reset to zero" },
          { name: "elapsed", params: "", returns: "TimeSpan^", description: "Get elapsed time" },
          { name: "elapsedMilliseconds", params: "", returns: "Integer^", description: "Elapsed in ms" },
          { name: "isRunning", params: "", returns: "Bool^", description: "Check if running" },
        ],
        examples: [
          {
            title: "Timer Usage",
            code: `Instantiate Time::Timer^ As <timer> = Time::Timer::Constructor();
Run timer.start();

// ... perform operation ...

Run timer.stop();
Instantiate Integer^ As <ms> = timer.elapsedMilliseconds();
Run Console::printLine(String::Constructor("Elapsed: ").append(ms.toString()).append(String::Constructor("ms")));`,
          },
        ],
      },
    ],
  },
  // ===== JSON MODULE =====
  {
    slug: "json",
    name: "JSON",
    description: "JSON parsing and generation for data interchange.",
    importPath: "Language::Format",
    classes: [
      {
        slug: "jsonobject",
        name: "JSONObject",
        description: "Key-value object for JSON data.",
        methods: [
          { name: "Constructor", params: "", returns: "JSONObject^", description: "Create empty JSON object" },
          { name: "set", params: "key: String^, value: String^", returns: "None", description: "Set key to value" },
          { name: "get", params: "key: String^", returns: "String^", description: "Get value or empty string" },
          { name: "has", params: "key: String^", returns: "Bool^", description: "Check if key exists" },
          { name: "remove", params: "key: String^", returns: "None", description: "Remove key" },
          { name: "size", params: "", returns: "Integer^", description: "Number of pairs" },
          { name: "getInteger", params: "key: String^", returns: "Integer^", description: "Parse value as integer" },
          { name: "getBool", params: "key: String^", returns: "Bool^", description: "Parse value as boolean" },
          { name: "stringify", params: "", returns: "String^", description: "Convert to JSON string" },
        ],
        examples: [
          {
            title: "JSONObject Usage",
            code: `Instantiate Format::JSONObject^ As <obj> = Format::JSONObject::Constructor();
Run obj.set(String::Constructor("name"), String::Constructor("Alice"));
Run obj.set(String::Constructor("age"), String::Constructor("30"));

Instantiate String^ As <json> = obj.stringify();
// Result: {"name":"Alice","age":"30"}

Instantiate Integer^ As <age> = obj.getInteger(String::Constructor("age"));  // 30`,
          },
        ],
      },
      {
        slug: "jsonarray",
        name: "JSONArray",
        description: "Ordered array of JSON values.",
        methods: [
          { name: "Constructor", params: "", returns: "JSONArray^", description: "Create empty JSON array" },
          { name: "add", params: "value: String^", returns: "None", description: "Add to end" },
          { name: "get", params: "index: Integer^", returns: "String^", description: "Get value at index" },
          { name: "remove", params: "index: Integer^", returns: "None", description: "Remove at index" },
          { name: "size", params: "", returns: "Integer^", description: "Number of elements" },
          { name: "stringify", params: "", returns: "String^", description: "Convert to JSON string" },
        ],
        examples: [
          {
            title: "JSONArray Usage",
            code: `Instantiate Format::JSONArray^ As <arr> = Format::JSONArray::Constructor();
Run arr.add(String::Constructor("first"));
Run arr.add(String::Constructor("second"));

Instantiate String^ As <json> = arr.stringify();
// Result: ["first","second"]`,
          },
        ],
      },
    ],
  },
  // ===== HTTP MODULE =====
  {
    slug: "http",
    name: "HTTP",
    description: "HTTP client and server functionality for web requests.",
    importPath: "Language::Network",
    classes: [
      {
        slug: "httpclient",
        name: "HTTPClient",
        description: "HTTP client for making web requests.",
        methods: [
          { name: "Constructor", params: "", returns: "HTTPClient^", description: "Create HTTP client" },
          { name: "setHeader", params: "key: String^, value: String^", returns: "None", description: "Set request header" },
          { name: "setTimeout", params: "milliseconds: Integer^", returns: "None", description: "Set timeout" },
          { name: "performGet", params: "url: String^", returns: "HTTPResponse^", description: "GET request" },
          { name: "performPost", params: "url: String^, data: String^", returns: "HTTPResponse^", description: "POST request" },
        ],
        examples: [
          {
            title: "HTTP Client Usage",
            code: `Instantiate Network::HTTPClient^ As <client> = Network::HTTPClient::Constructor();
Run client.setHeader(String::Constructor("Accept"), String::Constructor("application/json"));
Run client.setTimeout(Integer::Constructor(5000));

Instantiate Network::HTTPResponse^ As <response> = client.performGet(
    String::Constructor("https://api.example.com/data")
);

If (response.isSuccess()) -> {
    Run Console::printLine(response.getBody());
}`,
          },
        ],
      },
      {
        slug: "httpresponse",
        name: "HTTPResponse",
        description: "Represents an HTTP response.",
        methods: [
          { name: "Constructor", params: "", returns: "HTTPResponse^", description: "Create response object" },
          { name: "getStatusCode", params: "", returns: "Integer^", description: "Status code (200, 404, etc.)" },
          { name: "getBody", params: "", returns: "String^", description: "Response content" },
          { name: "isSuccess", params: "", returns: "Bool^", description: "True for 200-299" },
          { name: "isError", params: "", returns: "Bool^", description: "True for 400+" },
        ],
        examples: [],
      },
      {
        slug: "httpserver",
        name: "HTTPServer",
        description: "Simple HTTP server (experimental).",
        methods: [
          { name: "Constructor", params: "", returns: "HTTPServer^", description: "Create HTTP server" },
          { name: "listen", params: "port: Integer^", returns: "None", description: "Start listening" },
          { name: "stop", params: "", returns: "None", description: "Stop server" },
          { name: "isRunning", params: "", returns: "Bool^", description: "True if running" },
        ],
        examples: [
          {
            title: "HTTP Server",
            code: `Instantiate Network::HTTPServer^ As <server> = Network::HTTPServer::Constructor();
Run server.listen(Integer::Constructor(8080));

If (server.isRunning()) -> {
    Run Console::printLine(String::Constructor("Server running on port 8080"));
}`,
          },
        ],
      },
    ],
  },
  // ===== TESTING MODULE =====
  {
    slug: "testing",
    name: "Testing",
    description: "Unit testing framework with reflection-based test discovery.",
    importPath: "Language::Test",
    classes: [
      {
        slug: "assert",
        name: "Assert",
        description: "Static assertion methods for verifying test conditions.",
        methods: [
          { name: "isTrue", params: "condition: Bool&, message: String&", returns: "None", description: "Assert condition is true" },
          { name: "isFalse", params: "condition: Bool&, message: String&", returns: "None", description: "Assert condition is false" },
          { name: "equals", params: "expected: Integer&, actual: Integer&, message: String&", returns: "None", description: "Assert integers are equal" },
          { name: "equalsString", params: "expected: String&, actual: String&, message: String&", returns: "None", description: "Assert strings are equal" },
          { name: "notNull", params: "message: String&", returns: "None", description: "Reserved for nullable types" },
          { name: "fail", params: "message: String&", returns: "None", description: "Explicitly fail the test" },
        ],
        examples: [
          {
            title: "Assertion Examples",
            code: `// Boolean assertions
Run Assert::isTrue(result.greaterThan(Integer::Constructor(0)), String::Constructor("Result should be positive"));
Run Assert::isFalse(list.isEmpty(), String::Constructor("List should not be empty"));

// Equality assertions
Run Assert::equals(
    Integer::Constructor(42),
    calculator.compute(),
    String::Constructor("Computation result")
);

Run Assert::equalsString(
    String::Constructor("hello"),
    greeting.toLowerCase(),
    String::Constructor("Greeting should be lowercase")
);`,
          },
        ],
      },
      {
        slug: "testrunner",
        name: "TestRunner",
        description: "The main test execution engine.",
        methods: [
          { name: "Constructor", params: "", returns: "TestRunner^", description: "Create test runner" },
          { name: "runTestClass", params: "typeName: String^", returns: "TestSummary^", description: "Run all tests in a class" },
          { name: "run", params: "typeName: String^", returns: "Integer^", description: "Run tests and return exit code" },
          { name: "fail", params: "message: String^", returns: "None", description: "Mark current test as failed" },
        ],
        examples: [
          {
            title: "Running Tests",
            code: `Instantiate TestRunner^ As <runner> = TestRunner::Constructor();

// Option 1: Get detailed summary
Instantiate TestSummary^ As <summary> = runner.runTestClass(String::Constructor("MyTests"));
Run summary.printSummary();

// Option 2: Run and get exit code directly
Instantiate Integer^ As <exitCode> = runner.run(String::Constructor("MyTests"));
// exitCode is 0 if all passed, 1 if any failed`,
          },
        ],
      },
      {
        slug: "testresult",
        name: "TestResult",
        description: "Represents the result of a single test execution.",
        methods: [
          { name: "testName", category: "Properties", params: "", returns: "String^", description: "Name of the test method" },
          { name: "passed", category: "Properties", params: "", returns: "Bool^", description: "Whether the test passed" },
          { name: "message", category: "Properties", params: "", returns: "String^", description: "Success/failure message" },
          { name: "durationMs", category: "Properties", params: "", returns: "Integer^", description: "Execution time in milliseconds" },
        ],
        examples: [],
      },
      {
        slug: "testsummary",
        name: "TestSummary",
        description: "Aggregates results from multiple tests.",
        methods: [
          { name: "totalTests", category: "Properties", params: "", returns: "Integer^", description: "Total number of tests run" },
          { name: "passedTests", category: "Properties", params: "", returns: "Integer^", description: "Number of passing tests" },
          { name: "failedTests", category: "Properties", params: "", returns: "Integer^", description: "Number of failing tests" },
          { name: "results", category: "Properties", params: "", returns: "List<TestResult>^", description: "Individual test results" },
          { name: "addResult", params: "result: TestResult^", returns: "None", description: "Add a test result" },
          { name: "allPassed", params: "", returns: "Bool^", description: "Check if all tests passed" },
          { name: "printSummary", params: "", returns: "None", description: "Print formatted summary" },
        ],
        examples: [],
      },
    ],
  },
];

async function seedStdlibDocs() {
  console.log("Seeding Standard Library documentation...");

  for (let moduleIndex = 0; moduleIndex < stdlibModules.length; moduleIndex++) {
    const moduleData = stdlibModules[moduleIndex];

    // Upsert the module
    const docModule = await prisma.docModule.upsert({
      where: { slug: moduleData.slug },
      update: {
        name: moduleData.name,
        description: moduleData.description,
        importPath: moduleData.importPath,
        sortOrder: moduleIndex,
      },
      create: {
        slug: moduleData.slug,
        name: moduleData.name,
        description: moduleData.description,
        importPath: moduleData.importPath,
        sortOrder: moduleIndex,
      },
    });

    console.log(`  Module: ${moduleData.name}`);

    // Delete existing classes for this module (to refresh)
    await prisma.docClass.deleteMany({
      where: { moduleId: docModule.id },
    });

    // Create classes
    for (let classIndex = 0; classIndex < moduleData.classes.length; classIndex++) {
      const classData = moduleData.classes[classIndex];

      const docClass = await prisma.docClass.create({
        data: {
          slug: classData.slug,
          name: classData.name,
          description: classData.description,
          constraints: classData.constraints,
          sortOrder: classIndex,
          moduleId: docModule.id,
        },
      });

      // Create methods
      for (let methodIndex = 0; methodIndex < classData.methods.length; methodIndex++) {
        const methodData = classData.methods[methodIndex];
        await prisma.docMethod.create({
          data: {
            name: methodData.name,
            category: methodData.category || "Methods",
            params: methodData.params,
            returns: methodData.returns,
            description: methodData.description,
            sortOrder: methodIndex,
            classId: docClass.id,
          },
        });
      }

      // Create examples
      for (let exampleIndex = 0; exampleIndex < classData.examples.length; exampleIndex++) {
        const exampleData = classData.examples[exampleIndex];
        await prisma.docExample.create({
          data: {
            title: exampleData.title,
            code: exampleData.code,
            filename: exampleData.filename,
            showLines: exampleData.showLines || false,
            sortOrder: exampleIndex,
            classId: docClass.id,
          },
        });
      }

      console.log(`    Class: ${classData.name} (${classData.methods.length} methods, ${classData.examples.length} examples)`);
    }
  }

  console.log(`Seeded ${stdlibModules.length} modules`);
}

async function main() {
  console.log("Seeding database...");

  // Create default labels for issues
  const labels = [
    { name: "bug", color: "#d73a4a", description: "Something isn't working" },
    { name: "feature", color: "#a2eeef", description: "New feature or request" },
    { name: "enhancement", color: "#84b6eb", description: "Improvement to existing functionality" },
    { name: "documentation", color: "#0075ca", description: "Improvements or additions to documentation" },
    { name: "question", color: "#d876e3", description: "Further information is requested" },
    { name: "help wanted", color: "#008672", description: "Extra attention is needed" },
    { name: "good first issue", color: "#7057ff", description: "Good for newcomers" },
    { name: "duplicate", color: "#cfd3d7", description: "This issue or pull request already exists" },
    { name: "wontfix", color: "#ffffff", description: "This will not be worked on" },
    { name: "invalid", color: "#e4e669", description: "This doesn't seem right" },
    { name: "compiler", color: "#fbca04", description: "Related to the XXML compiler" },
    { name: "stdlib", color: "#1d76db", description: "Related to the standard library" },
    { name: "performance", color: "#f9d0c4", description: "Performance-related issue" },
  ];

  for (const label of labels) {
    await prisma.label.upsert({
      where: { name: label.name },
      update: label,
      create: label,
    });
  }
  console.log(`Created ${labels.length} labels`);

  // Create forum categories
  const categories = [
    {
      name: "Announcements",
      slug: "announcements",
      description: "Official announcements about XXML",
      color: "#dc2626",
      sortOrder: 0,
    },
    {
      name: "General Discussion",
      slug: "general",
      description: "General discussions about XXML programming",
      color: "#3b82f6",
      sortOrder: 1,
    },
    {
      name: "Help & Support",
      slug: "help",
      description: "Get help with XXML programming questions",
      color: "#22c55e",
      sortOrder: 2,
    },
    {
      name: "Show & Tell",
      slug: "showcase",
      description: "Share your XXML projects and creations",
      color: "#a855f7",
      sortOrder: 3,
    },
    {
      name: "Ideas & Feedback",
      slug: "ideas",
      description: "Suggest ideas and provide feedback for XXML",
      color: "#f59e0b",
      sortOrder: 4,
    },
    {
      name: "Tutorials & Guides",
      slug: "tutorials",
      description: "Community tutorials and guides",
      color: "#06b6d4",
      sortOrder: 5,
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }
  console.log(`Created ${categories.length} categories`);

  // Seed Standard Library documentation
  await seedStdlibDocs();

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
