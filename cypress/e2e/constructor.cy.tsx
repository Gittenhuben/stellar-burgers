describe('Проверка конструктора бургера', () => {

  function setIntercepts() {
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', { fixture: 'ingredients' });
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', { fixture: 'user' }).as('user');
    cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', { fixture: 'order' }).as('order');
  }

  describe('Проверка действий в конструкторе', () => {

    beforeEach(() => {
      setIntercepts();
      cy.visit('http://localhost:4000');
    });

    it('Тест добавления ингредиентов в конструктор', () => {
      cy.get('*[class*="burger-constructor-module__noBuns"]').should('have.length', 3);

      cy.get('*[class*="burger-ingredient-module__addButton"]').eq(1).as('bunButton').click();
      cy.get('*[class*="burger-ingredient-module__addButton"]').eq(3).as('mainButton').click();
      cy.get('*[class*="burger-ingredient-module__addButton"]').eq(12).as('sauceButton').click();

      cy.get('@bunButton').parent().find('*[class*="burger-ingredient-module__text"]').then(buttonName => {
        cy.get('.constructor-element__text').eq(0).should('have.text', buttonName.text() + ' (верх)');
      });

      cy.get('@mainButton').parent().find('*[class*="burger-ingredient-module__text"]').then(buttonName => {
        cy.get('.constructor-element__text').eq(1).should('have.text', buttonName.text());
      });

      cy.get('@sauceButton').parent().find('*[class*="burger-ingredient-module__text"]').then(buttonName => {
        cy.get('.constructor-element__text').eq(2).should('have.text', buttonName.text());
      });
    });

    it('Тест открытия модального окна ингредиента', () => {
      cy.get('*[class*="modal-module__modal"]').should('not.exist');
      cy.get('*[class*="burger-ingredient-module__article"]').eq(2).as('article').click();
      cy.get('*[class*="modal-module__modal"]').should('exist');
      cy.get('@article').find('*[class*="burger-ingredient-module__text"]').then(buttonName => {
        cy.get('*[class*="ingredient-details-module__content"]')
          .find('*[class*="text_type_main-medium"]')
          .should('have.text', buttonName.text());
      });
    });

    it('Тест закрытия модального окна ингредиента по кнопке', () => {
      cy.get('*[class*="burger-ingredient-module__article"]').eq(2).as('article').click();
      cy.get('*[class*="modal-module__button"]').click();
      cy.get('*[class*="modal-module__modal"]').should('not.exist');
    });

    it('Тест закрытия модального окна ингредиента по клику в оверлей', () => {
      cy.get('*[class*="burger-ingredient-module__article"]').eq(2).as('article').click();
      cy.get('body').click(0,0);
      cy.get('*[class*="modal-module__modal"]').should('not.exist');
    });

  });

  describe('Проверка создания заказа', () => {

    it('Тест создания заказа', () => {
      
      setIntercepts();

      const tokens = require('../fixtures/tokens.json');
      cy.setCookie('accessToken', tokens.accessToken);
      window.localStorage.setItem('refreshToken', tokens.refreshToken);

      cy.visit('http://localhost:4000');

      cy.get('@user').its('response.body.user.name').then(userName => {
        cy.get('.text_type_main-default').eq(2).should('have.text', userName);
      });

      cy.get('*[class*="burger-ingredient-module__addButton"]').eq(1).as('bunButton').click();
      cy.get('*[class*="burger-ingredient-module__addButton"]').eq(3).as('mainButton').click();
      cy.get('*[class*="burger-ingredient-module__addButton"]').eq(12).as('sauceButton').click();

      cy.get('button[class="button button_type_primary button_size_large"]').click();
      cy.get('*[class*="modal-module__modal"]').should('exist');
      cy.get('@order').its('response.body.order.number').then(orderNumber => {
        cy.get('*[class*="text_type_digits-large"]').should('have.text', orderNumber);
      });

      cy.get('*[class*="modal-module__button"]').click();
      cy.get('*[class*="modal-module__modal"]').should('not.exist');

      cy.get('*[class*="burger-constructor-module__noBuns"]').should('have.length', 3);

      cy.clearLocalStorage('refreshToken');
      cy.clearCookie('accessToken');
    });

  });

});
