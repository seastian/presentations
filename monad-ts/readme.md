---
author:
- for TS developers
title: Some ideas from Functional Programming
---

# Disclaimer

These are just some ideas. Don’t focus too much on the language.

------------------------------------------------------------------------

# Form Validation

# Form Type

``` typescript
type FormData = { name: string; email: string; age: string };
```

. . .

We could just as well have chosen a different representation

``` typescript
type FormDataAlternativeRepresentation = [string, string, string];
```

What’s important here is to realize that any datatype that can store
three values would work.

A value of type `FormData`:

``` typescript
const formData: FormData = {
  name: "sebastian",
  email: "email@email.com",
  age: "27",
};
```

------------------------------------------------------------------------

# Validated Form Type

Endgoal is to get:

``` typescript
type ValidatedForm = { name: Name; email: Email };
```

. . .

Where `Name` and `Email` are types that encapsulate the business rules
for `name` and `email`.

`name` should not be null

`name` should not be too long

etc

\* Let’s for a moment forget about `age`

# Validate Form Function

. . .

``` typescript
type ValidateForm = (f: FormData) => Maybe<ValidatedForm>;
```

We need a `Maybe` type because not every `FormData` can be converted
into a `ValidatedForm`

``` typescript
type Maybe<A> = Nothing | Just<A>;
```

What this data type says is that `Maybe<A>` can be `Nothing` or
`Just<A>`. `Just` is parametrized by another type `A`.

We are going to use some utility functions that let us build values for
those types.

``` typescript
type Just<A> = { tag: "Just"; value: A };
type JustConstructor = <A>(a: A) => Just<A>;
```

``` typescript
const Just: JustConstructor = (a) => ({ tag: "Just", value: a });
```

``` typescript
type Nothing = { tag: "Nothing" };
type NothingConstructor = () => Nothing;
```

``` typescript
const Nothing: NothingConstructor = () => ({ tag: "Nothing" });
```

\* We need the `tag` field so that we can switch at the value level.

# Let’s go back to the Name type

. . .

``` typescript
type Name = { tag: "Name"; value: string };
```

`Name` type just wraps a `string`

But in order to construct it from a `string` we will check it complies
with some business rules

``` typescript
type NameConstructor = (n: string) => Maybe<Name>;
```

That’s why we return a `Maybe<Name>`

And here’s a basic implementation

``` typescript
const name: NameConstructor = (n: string) =>
  n.length === 0 ? Nothing() :
  n.length > 20 ? Nothing() :
  Just({ tag: "Name", value: n });
```

# We can do the same thing for Email type

. . .

``` typescript
type Email = { tag: "Email"; email: string };
```

``` typescript
type EmailConstructor = (e: string) => Maybe<Email>;
```

``` typescript
const email: EmailConstructor = (email: string) =>
  Just({ tag: "Email", email });
```

# Attempt I

. . .

``` typescript
type ValidateForm = (f: FormData) => Maybe<ValidatedForm>;
```

``` typescript
const validateForm: ValidateForm = (f) => {
  const maybeName = name(f.name);
  switch (maybeName.tag) {
    case "Nothing":
      return Nothing();
    case "Just": {
      const maybeEmail = email(f.email);
      switch (maybeEmail.tag) {
        case "Nothing":
          return Nothing();
        case "Just": {
          return Just({ name: maybeName.value, email: maybeEmail.value });
        }
      }
    }
  }
};
```

# Let’s get rid of `switch`

. . .

``` typescript
type MatchMaybe = <A, C>(
  m: Maybe<A>,
  matcher: {
    Just: (a: A) => C;
    Nothing: () => C;
  }
) => C;
```

``` typescript
const matchMaybe: MatchMaybe = (m, { Just, Nothing }) => {
  switch (m.tag) {
    case "Nothing":
      return Nothing();
    case "Just":
      return Just(m.value);
  }
};
```

# Attempt II

. . .

``` typescript
const validateForm2: ValidateForm = (f) =>
  matchMaybe(name(f.name), {
    Just: (name) =>
      matchMaybe(email(f.email), {
        Just: (email) => Just({ name, email }) as Maybe<ValidatedForm>,
        Nothing,
      }),
    Nothing,
  });
```

# Let’s get rid of those `Nothing()`

. . .

``` typescript
type BindMaybe = <A, B>(m: Maybe<A>, b: (a: A) => Maybe<B>) => Maybe<B>;
```

``` typescript
const bindMaybe: BindMaybe = (m, fn) => matchMaybe(m, { Just: fn, Nothing });
```

# Attempt III

. . .

``` typescript
const validateForm3: ValidateForm = (f) =>
  bindMaybe(name(f.name), name =>
  bindMaybe(email(f.email), email =>
  Just({ name, email })
));
```

# Now let’s add Age back

. . .

``` typescript
type Age = { tag: "Age"; age: number };
```

`Age` type just wraps a `number`

But in order to construct it from a `number` we will check it complies
with some business rules

``` typescript
type AgeConstructor = (a: number) => Maybe<Age>;
```

That’s why we return a `Maybe<Age>`

And here’s a basic implementation

``` typescript
const age: AgeConstructor = (age) =>
  age < 0 ? Nothing() :
  age > 120 ? Nothing() :
  Just({ tag: "Age", age });
```

# Houston we have problem!

. . .

``` typescript
type FormData = { name: string; email: string; age: string };
```

`age` field in `FormData` is of type `string` because that’s how we get
it from the user…

``` typescript
type IntegerFromString = (s: string) => Maybe<number>;
```

``` typescript
const integer: IntegerFromString = (s) => {
  const i = parseInt(s);
  return isNaN(i) ? Nothing() : Just(i);
};
```

``` typescript
type AgeFromString = (s: string) => Maybe<Age>;
```

``` typescript
const ageFromString: AgeFromString = (s) => bindMaybe(integer(s), age);
```

# Final version!

. . .

``` typescript
type FullValidatedForm = { name: Name; email: Email; age: Age };
type FullValidateForm = (f: FormData) => Maybe<FullValidatedForm>;
```

``` typescript
export const fullValidateForm: FullValidateForm = (f) =>
  bindMaybe(validateForm3(f), ({ name, email }) =>
  bindMaybe(ageFromString(f.age), (age) =>
  Just({ name, email, age })
));
```
