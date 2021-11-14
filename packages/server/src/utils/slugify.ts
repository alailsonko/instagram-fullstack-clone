import slugify from "slugify"

function slugifyParser(slug: string) {
  return slugify(slug, {
    remove: /[*+~.()'"!|:@-^;]/g,
    replacement: '_'
  })
}
export {
  slugifyParser
}
