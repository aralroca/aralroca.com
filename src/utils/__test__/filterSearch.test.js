import filterSearch from "../filterSearch"

describe('filterSearch', () => {
  let posts
  beforeAll(() => {
    posts = [{
      metadata: {
        title: 'Example of pOst aBout something',
        description: "ThIs text is just an example of something",
        tags: "react, tenSorflow, machIne-learning"
      }
    },
    {
      metadata: {
        title: 'Example2 of post2 about SoMething2',
        description: "This text2 is just an examPle2 of something2",
        tags: "react, tensorflow, machiNe-learning, javascript"
      }
    }]
  })

  test('should filter if the word is in the title', () => {
    const input = 'post2'
    const output = posts.filter(filterSearch(input))

    expect(output.length).toBe(1)
    expect(output[0].title).toBe(posts[1].title)
  })

  test('should filter if multiple words are in the title', () => {
    const input = 'somEthing2 pOst2'
    const output = posts.filter(filterSearch(input))

    expect(output.length).toBe(1)
    expect(output[0].title).toBe(posts[1].title)
  })

  test('should get all if all words exists in all title posts', () => {
    const input = 'ABOut of'
    const output = posts.filter(filterSearch(input))

    expect(output.length).toBe(2)
    expect(output[0].title).toBe(posts[0].title)
    expect(output[1].title).toBe(posts[1].title)
  })

  test('should filter searching one word from title (common in posts) + word tag (uniq in one post)', () => {
    const input = 'aBoUt JaVaScRiPT'
    const output = posts.filter(filterSearch(input))

    expect(output.length).toBe(1)
    expect(output[0].title).toBe(posts[1].title)
  })

  test('should work with not finished word (meanwhile the user is typing)', () => {
    const input = 'javaSCR'
    const output = posts.filter(filterSearch(input))

    expect(output.length).toBe(1)
    expect(output[0].title).toBe(posts[1].title)
  })
})
