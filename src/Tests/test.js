describe("pow", function() {

    describe("возводит x в 3 степень", function() {
        function makeTest(x) {
            let expected = x * x * x;
            it(`${x} в степени 3 будет ${expected}`, function() {
              assert.equal(pow(x, 3), expected);
            });
          }
        
          for (let x = 1; x <= 5; x++) {
            makeTest(x);
          }
    })

    describe('Проверка корректности введных данных', function() {
        it("для отрицательных n возвращает NaN", function() {
            assert.isNaN(pow(2, -1));
          });
        
          it("для дробных n возвращает NaN", function() {
            assert.isNaN(pow(2, 1.5));
          });

          it("для дробных значений меньше 1 возвращает NaN", function() {
              assert.isNaN(pow(2, 0.3))
          })
    })
  
  });