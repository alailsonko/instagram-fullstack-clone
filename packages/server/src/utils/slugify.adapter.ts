import SlugifyValidator from '../presentation/protocols/slugify.protocol'
import slugify from 'slugify'

export default class SlugifyValidatorAdapter implements SlugifyValidator {
  handle (username: string): string {
    return slugify(username, {
      replacement: '_',
      remove: /[*+~()'"!:@]/g,
      lower: true
    })
  }
}
