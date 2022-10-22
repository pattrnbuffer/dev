  returns the context value for the layer
  (transform already applied at the context level)

  in jotai we would read from the getter of the atom

  to have an atom for a layer we need the provider to create one
  while also reading from the layer above

  it must initialize the atom with the proper state
  - it will set the atom to a transformation of the parent value
  it must update the atom at the right time with the proper state
  - use effect will run when the parent context value changes
    and set the atom to a transformation of the new parent value
  it must return the value and efficiently memoize
  - it requires no memoization, simple layer is just an incrementing number
  could it not have overlap of layers?
  - that could only be possible if each provider
    (which establishes the same layer for each depth of the tree)
    could produce the proper super set of both
    as a simple layer key there would be no signficane
    you are a member of your current and every prior and have a
    value equal to your depth
