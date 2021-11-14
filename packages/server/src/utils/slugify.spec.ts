import { slugifyParser } from './slugify'

describe('Slugify', () => {
   test('should remove special characthers', () => {
     expect(slugifyParser('123!4*+~')).toBe('1234')
   })
   
})
