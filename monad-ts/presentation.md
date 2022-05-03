% Some ideas from Functional Programming
% for TS developers

# Disclaimer

These are just some ideas. Don't focus too much on the language.

---

# Form Validation 


# Form Type

```{.typescript include=applicative.ts snippet=FormData}
```

. . .

We could just as well have chosen a different representation

```{.typescript include=applicative.ts snippet=FormDataAlternativeRepresentation}
```

What's important here is to realize that any datatype that can store three
values would work.

A value of type `FormData`:

```{.typescript include=applicative.ts snippet=formData}
```

---

# Validated Form Type

Endgoal is to get: 


```{.typescript include=applicative.ts snippet=ValidatedForm}
```

. . .

Where `Name` and `Email` are types that encapsulate the business rules for
`name` and `email`.

`name` should not be null

`name` should not be too long

etc

\* Let's for a moment forget about `age`

# Validate Form Function

. . .

```{.typescript include=applicative.ts snippet=ValidateForm}
```

We need a `Maybe` type because not every `FormData` can be converted into a
`ValidatedForm`

```{.typescript include=applicative.ts snippet=Maybe}
```

What this data type says is that `Maybe<A>` can be `Nothing` or `Just<A>`.
`Just` is parametrized by another type `A`. 

We are going to use some utility functions that let us build values for those
types.

```{.typescript include=applicative.ts snippet=Just}
```
```{.typescript include=applicative.ts snippet=JustConstructor}
```
```{.typescript include=applicative.ts snippet=Nothing}
```
```{.typescript include=applicative.ts snippet=NothingConstructor}
```

\* We need the `tag` field so that we can switch at the value level.

# Let's go back to the Name type

. . . 

```{.typescript include=applicative.ts snippet=Name}
```

`Name` type just wraps a `string`

But in order to construct it from a `string` we will check it complies with some
business rules

```{.typescript include=applicative.ts snippet=NameConstructor}
```

That's why we return a `Maybe<Name>`

And here's a basic implementation

```{.typescript include=applicative.ts snippet=name}
```

# We can do the same thing for Email type

. . . 

```{.typescript include=applicative.ts snippet=Email}
```

```{.typescript include=applicative.ts snippet=EmailConstructor}
```

```{.typescript include=applicative.ts snippet=email}
```

# Attempt I

. . . 

```{.typescript include=applicative.ts snippet=ValidateForm}
```

```{.typescript include=applicative.ts snippet=validateForm}
```


# Let's get rid of `switch`

. . . 

```{.typescript include=applicative.ts snippet=MatchMaybe}
```

```{.typescript include=applicative.ts snippet=matchMaybe}
```

# Attempt II

. . .

```{.typescript include=applicative.ts snippet=validateForm2}
```

# Let's get rid of those `Nothing()`

. . . 

```{.typescript include=applicative.ts snippet=BindMaybe}
```

```{.typescript include=applicative.ts snippet=bindMaybe}
```

# Attempt III 

. . . 

```{.typescript include=applicative.ts snippet=validateForm3}
```

# Now let's add Age back

. . . 

```{.typescript include=applicative.ts snippet=Age}
```

`Age` type just wraps a `number`

But in order to construct it from a `number` we will check it complies with some
business rules

```{.typescript include=applicative.ts snippet=AgeConstructor}
```

That's why we return a `Maybe<Age>`

And here's a basic implementation

```{.typescript include=applicative.ts snippet=age}
```

# Houston we have problem!

. . .

```{.typescript include=applicative.ts snippet=FormData}
```

`age` field in `FormData` is of type `string` because that's how we get it from
the user...

```{.typescript include=applicative.ts snippet=Integer}
```

```{.typescript include=applicative.ts snippet=integer}
```

```{.typescript include=applicative.ts snippet=AgeFromString}
```

```{.typescript include=applicative.ts snippet=ageFromString}
```

# Final version!

. . .

```{.typescript include=applicative.ts snippet=FullValidatedForm}
```

```{.typescript include=applicative.ts snippet=fullValidatedForm}
```

