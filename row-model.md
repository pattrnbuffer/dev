# Elmer's Glue Model

```tsx
const AllTheThings = () => (
  <Layout>
    <Header>
      <BackControl
        onBack={specialStateForThing2_a ? normalBack : __special_back_for_thing2__}
      />
    </Header>
    <Body>{whichThing ? <Thing1 /> : <Thing2 />}</Body>
    <Footer>
      {whichThing ? (
        <NormalContent />
      ) : specialDetailForThing2_b ? (
        <Thing2Footer1 />
      ) : (
        <Thing2Footer2 />
      )}
    </Footer>
  </Layout>
);
```

# Row Model

```tsx
const TheThings = () => (decidingThing ? <Thing1 /> : <Thing2 />);

const Thing1 = () => (
  <Layout>
    <Header>
      <BackControl onBack={goBack} />
    </Header>
    <Body>Thing 1</Body>
    <Footer>
      <NormalContent />
    </Footer>
  </Layout>
);

const Thing2 = () => (
  <Layout>
    <Header>
      <BackControl onBack={goBack} />
    </Header>
    <Body>Thing 2</Body>
    <Footer>{someLocalDetail ? footerStuff : otherFooterStuff}</Footer>
  </Layout>
);
```
