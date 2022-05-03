export {};

// start snippet FormData
type FormData = { name: string; email: string; age: string };
// end snippet FormData

// start snippet FormDataAlternativeRepresentation
type FormDataAlternativeRepresentation = [string, string, string];
// end snippet FormDataAlternativeRepresentation

// start snippet formData
const formData: FormData = {
  name: "sebastian",
  email: "email@email.com",
  age: "27",
};
// end snippet formData

// start snippet Just
type Just<A> = { tag: "Just"; value: A };
type JustConstructor = <A>(a: A) => Just<A>;
// end snippet Just
// start snippet JustConstructor
const Just: JustConstructor = (a) => ({ tag: "Just", value: a });
// end snippet JustConstructor

// start snippet Nothing
type Nothing = { tag: "Nothing" };
type NothingConstructor = () => Nothing;
// end snippet Nothing
// start snippet NothingConstructor
const Nothing: NothingConstructor = () => ({ tag: "Nothing" });
// end snippet NothingConstructor

// start snippet Maybe
type Maybe<A> = Nothing | Just<A>;
// end snippet Maybe

// start snippet Name
type Name = { tag: "Name"; value: string };
// end snippet Name
// start snippet NameConstructor
type NameConstructor = (n: string) => Maybe<Name>;
// end snippet NameConstructor

// prettier-ignore
// start snippet name
const name: NameConstructor = (n: string) =>
  n.length === 0 ? Nothing() :
  n.length > 20 ? Nothing() :
  Just({ tag: "Name", value: n });
// end snippet name

// start snippet Email
type Email = { tag: "Email"; email: string };
// end snippet Email
// start snippet EmailConstructor
type EmailConstructor = (e: string) => Maybe<Email>;
// end snippet EmailConstructor
// start snippet email
const email: EmailConstructor = (email: string) =>
  Just({ tag: "Email", email });
// end snippet email

// start snippet ValidatedForm
type ValidatedForm = { name: Name; email: Email };
// end snippet ValidatedForm
// start snippet ValidateForm
type ValidateForm = (f: FormData) => Maybe<ValidatedForm>;
// end snippet ValidateForm
// start snippet validateForm
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
// end snippet validateForm

// start snippet MatchMaybe
type MatchMaybe = <A, C>(
  m: Maybe<A>,
  matcher: {
    Just: (a: A) => C;
    Nothing: () => C;
  }
) => C;
// end snippet MatchMaybe

// start snippet matchMaybe
const matchMaybe: MatchMaybe = (m, { Just, Nothing }) => {
  switch (m.tag) {
    case "Nothing":
      return Nothing();
    case "Just":
      return Just(m.value);
  }
};
// end snippet matchMaybe

// start snippet validateForm2
const validateForm2: ValidateForm = (f) =>
  matchMaybe(name(f.name), {
    Just: (name) =>
      matchMaybe(email(f.email), {
        Just: (email) => Just({ name, email }) as Maybe<ValidatedForm>,
        Nothing,
      }),
    Nothing,
  });
// end snippet validateForm2

// start snippet BindMaybe
type BindMaybe = <A, B>(m: Maybe<A>, b: (a: A) => Maybe<B>) => Maybe<B>;
// end snippet BindMaybe
// start snippet bindMaybe
const bindMaybe: BindMaybe = (m, fn) => matchMaybe(m, { Just: fn, Nothing });
// end snippet bindMaybe

// prettier-ignore
// start snippet validateForm3
const validateForm3: ValidateForm = (f) =>
  bindMaybe(name(f.name), name =>
  bindMaybe(email(f.email), email =>
  Just({ name, email })
));
// end snippet validateForm3

// start snippet Integer
type IntegerFromString = (s: string) => Maybe<number>;
// end snippet Integer
// start snippet integer
const integer: IntegerFromString = (s) => {
  const i = parseInt(s);
  return isNaN(i) ? Nothing() : Just(i);
};
// end snippet integer

// start snippet Age
type Age = { tag: "Age"; age: number };
// end snippet Age
// start snippet AgeConstructor
type AgeConstructor = (a: number) => Maybe<Age>;
// end snippet AgeConstructor

// prettier-ignore
// start snippet age
const age: AgeConstructor = (age) =>
  age < 0 ? Nothing() :
  age > 120 ? Nothing() :
  Just({ tag: "Age", age });
// end snippet age

// start snippet AgeFromString
type AgeFromString = (s: string) => Maybe<Age>;
// end snippet AgeFromString
// start snippet ageFromString
const ageFromString: AgeFromString = (s) => bindMaybe(integer(s), age);
// end snippet ageFromString

const t = validateForm3({ name: "asdfasd", email: "asdfasd", age: "27" });

// start snippet FullValidatedForm
type FullValidatedForm = { name: Name; email: Email; age: Age };
type FullValidateForm = (f: FormData) => Maybe<FullValidatedForm>;
// end snippet FullValidatedForm

// prettier-ignore
// start snippet fullValidatedForm
export const fullValidateForm: FullValidateForm = (f) =>
  bindMaybe(validateForm3(f), ({ name, email }) =>
  bindMaybe(ageFromString(f.age), (age) =>
  Just({ name, email, age })
));
// end snippet fullValidatedForm

const vf = fullValidateForm(formData);
