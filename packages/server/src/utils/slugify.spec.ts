import { slugifyParser } from './slugify'

describe('Slugify', () => {
   test('should remove special characthers', () => {
     expect(slugifyParser('12&3!4*+~')).toBe('1234')
   })
   
})
