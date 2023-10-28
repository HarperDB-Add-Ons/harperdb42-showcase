export class Post extends tables.Post {
  async #fetchComments(postId) {
    return tables.Comment.search({
      conditions: [{ attribute: 'postId', comparator: 'equals', value: postId }],
      limit: 10,
      select: ['id', 'body']
    })
  }

  async get(query) {
    let results = await super.get(query)
    if (!results[Symbol.iterator]) {
      results.comments = await this.#fetchComments(results.id)
    } else {
      results = results.map(async (post) => {
        const postId = post.id
        const comments = await this.#fetchComments(postId)
        return { ...post, comments }
      })
    }

    return results
  }
}
