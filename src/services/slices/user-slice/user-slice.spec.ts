import { afterEach, describe, expect, test} from '@jest/globals';
import { TUser } from '@utils-types';
import { userSlice, getUserThunk, setUserThunk } from './user-slice';
import * as api from '../../../utils/burger-api';
import { configureStore } from '@reduxjs/toolkit';


describe('Проверка слайса конструктора', () => {

  const initialState = userSlice.getInitialState();

  const initialStateTrue = {
    ...initialState,
    isLoadingGetUser: true,
    isLoadingSetUser: true
  }

  const initialStateFalse = {
    ...initialState,
    isLoadingGetUser: false,
    isLoadingSetUser: false
  }

  const userData0 = {
    userName: initialState.userName,
    email: initialState.email
  }

  const userData1 = {
    userName: 'user1',
    email: 'user1@u.u'
  }

  const payloadUserData1: api.TRegisterData = {
    name: userData1.userName,
    email: userData1.email,
    password: 'password'
  }

  const responseUserData1 = {
    user: {
      name: userData1.userName,
      email: userData1.email
    } as TUser,
    success: true
  }

  describe('Проверка основных редьюсеров', () => {

    const expectedState1 = {
      ...initialState,
      ...userData1
    }

    const expectedState2 = {
      ...initialState,
      isLoadingGetUser: false
    }

    test('Тест добавления информации о пользователе', () => {
      const newState = userSlice.reducer(initialState, {type: 'user/setLocalUser', payload: userData1});
      expect(newState).toEqual(expectedState1);
    });

    test('Тест удаления информации о пользователе', () => {
      const newState = userSlice.reducer(expectedState1, {type: 'user/reset'});
      expect(newState).toEqual(expectedState2);
    });

  });


  describe('Проверка санка получения информации о пользователе', () => {

    describe('Проверка экшенов санка', () => {

      test('Тест getUserThunk, action: pending', () => {
        
        const fakeStore = configureStore({
          reducer: userSlice.reducer,
          preloadedState: initialStateFalse
        });

        const action = getUserThunk.pending('fakeRequestId');
        fakeStore.dispatch(action);

        const state = fakeStore.getState();
        expect(state.isLoadingGetUser).toBe(true);
      });

      test('Тест getUserThunk, action: fulfilled', () => {
        
        const fakeStore = configureStore({
          reducer: userSlice.reducer,
          preloadedState: initialStateTrue
        });

        const action = getUserThunk.fulfilled(responseUserData1, 'fakeRequestId');
        fakeStore.dispatch(action);

        const state = fakeStore.getState();
        expect(state.isLoadingGetUser).toBe(false);
        expect(state.userName).toBe(responseUserData1.user.name);
        expect(state.email).toBe(responseUserData1.user.email);
      });

      test('Тест getUserThunk, action: rejected', () => {
        
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        const fakeStore = configureStore({
          reducer: userSlice.reducer,
          preloadedState: initialStateTrue
        });

        const action = getUserThunk.rejected(new Error('fakeError'), 'fakeRequestId');
        fakeStore.dispatch(action);

        const state = fakeStore.getState();
        expect(state.isLoadingGetUser).toBe(false);
        expect(state.userName).toBe('');
        expect(state.email).toBe('');

        expect(logSpy).toHaveBeenCalledWith('fakeError');
      });

    });


    describe('Проверка санка getUserThunk', () => {  

      afterEach(() => {
        (api.getUserApi as jest.Mock).mockRestore();
      })

      test('Тест санка getUserThunk: pending', async () => {
        
        (api.getUserApi as jest.Mock) = jest.fn((data: string[]) => {
          return new Promise((resolve) => {
            setTimeout(() => resolve(responseUserData1), 1000);
          });
        });

        const fakeStore = configureStore({
          reducer: userSlice.reducer,
          preloadedState: initialStateFalse
        });

        fakeStore.dispatch(getUserThunk());

        const state = fakeStore.getState();
        expect(state.isLoadingGetUser).toBe(true);
        
      });

      test('Тест санка getUserThunk: fulfilled', async () => {
        
        (api.getUserApi as jest.Mock) = jest.fn((data: string[]) => Promise.resolve(responseUserData1));

        const fakeStore = configureStore({
          reducer: userSlice.reducer,
          preloadedState: initialStateTrue
        });

        await fakeStore.dispatch(getUserThunk());

        const state = fakeStore.getState();
        expect(state.isLoadingGetUser).toBe(false);
        expect(state.userName).toBe(responseUserData1.user.name);
        expect(state.email).toBe(responseUserData1.user.email);

      });

      test('Тест санка getUserThunk: rejected', async () => {
        
        (api.getUserApi as jest.Mock) = jest.fn((data: string[]) => Promise.reject('fakeError'));

        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        const fakeStore = configureStore({
          reducer: userSlice.reducer,
          preloadedState: initialStateTrue
        });

        await fakeStore.dispatch(getUserThunk());

        const state = fakeStore.getState();
        expect(state.isLoadingGetUser).toBe(false);
        expect(state.userName).toBe('');
        expect(state.email).toBe('');

        expect(logSpy).toHaveBeenCalledWith('Ошибка: fakeError');

      });

    });

  });




  describe('Проверка санка внесения информации о пользователе', () => {

    describe('Проверка экшенов санка', () => {

      test('Тест setUserThunk, action: pending', () => {
        
        const fakeStore = configureStore({
          reducer: userSlice.reducer,
          preloadedState: initialStateFalse
        });

        const action = setUserThunk.pending('fakeRequestId', payloadUserData1);
        fakeStore.dispatch(action);

        const state = fakeStore.getState();
        expect(state.isLoadingSetUser).toBe(true);
        expect(state.errorTextSetUser).toBe('');
      });

      test('Тест setUserThunk, action: fulfilled', () => {
        
        const fakeStore = configureStore({
          reducer: userSlice.reducer,
          preloadedState: initialStateTrue
        });

        const action = setUserThunk.fulfilled(responseUserData1, 'fakeRequestId', payloadUserData1);
        fakeStore.dispatch(action);

        const state = fakeStore.getState();
        expect(state.isLoadingSetUser).toBe(false);
        expect(state.userName).toBe(responseUserData1.user.name);
        expect(state.email).toBe(responseUserData1.user.email);
      });

      test('Тест setUserThunk, action: rejected (with message)', () => {
        
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        const fakeStore = configureStore({
          reducer: userSlice.reducer,
          preloadedState: initialStateTrue
        });

        const action = setUserThunk.rejected(new Error('fakeError'), 'fakeRequestId', payloadUserData1);
        fakeStore.dispatch(action);

        const state = fakeStore.getState();
        expect(state.isLoadingSetUser).toBe(false);
        expect(state.errorTextSetUser).toBe('fakeError');

        expect(logSpy).toHaveBeenCalledWith('fakeError');
      });

      test('Тест setUserThunk, action: rejected (without message)', () => {
        
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        const fakeStore = configureStore({
          reducer: userSlice.reducer,
          preloadedState: initialStateTrue
        });

        const action = setUserThunk.rejected(new Error(), 'fakeRequestId', payloadUserData1);
        fakeStore.dispatch(action);

        const state = fakeStore.getState();
        expect(state.isLoadingSetUser).toBe(false);
        expect(state.errorTextSetUser).toBe('Ошибка изменения данных пользователя');

        expect(logSpy).toHaveBeenCalledWith('Ошибка изменения данных пользователя');
      });

    });


    describe('Проверка санка setUserThunk', () => {  

      afterEach(() => {
        (api.updateUserApi as jest.Mock).mockRestore();
      })

      test('Тест санка setUserThunk: pending', async () => {
        
        (api.updateUserApi as jest.Mock) = jest.fn((user: api.TRegisterData) => {
          return new Promise((resolve) => {
            setTimeout(() => resolve(responseUserData1), 1000);
          });
        });

        const fakeStore = configureStore({
          reducer: userSlice.reducer,
          preloadedState: initialStateFalse
        });

        fakeStore.dispatch(setUserThunk(payloadUserData1));

        const state = fakeStore.getState();
        expect(state.isLoadingSetUser).toBe(true);
        expect(state.errorTextSetUser).toBe('');
        
      });

      test('Тест санка setUserThunk: fulfilled', async () => {
        
        (api.updateUserApi as jest.Mock) = jest.fn((user: api.TRegisterData) => Promise.resolve(responseUserData1));

        const fakeStore = configureStore({
          reducer: userSlice.reducer,
          preloadedState: initialStateTrue
        });

        await fakeStore.dispatch(setUserThunk(payloadUserData1));

        const state = fakeStore.getState();
        expect(state.isLoadingSetUser).toBe(false);
        expect(state.userName).toBe(responseUserData1.user.name);
        expect(state.email).toBe(responseUserData1.user.email);

      });

      test('Тест санка setUserThunk: rejected (with message)', async () => {

        const fakeError = {
          message: 'fakeError'
        };
        
        (api.updateUserApi as jest.Mock) = jest.fn((user: api.TRegisterData) => Promise.reject(fakeError));

        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        const fakeStore = configureStore({
          reducer: userSlice.reducer,
          preloadedState: initialStateTrue
        });

        await fakeStore.dispatch(setUserThunk(payloadUserData1));

        const state = fakeStore.getState();
        expect(state.isLoadingSetUser).toBe(false);
        expect(state.errorTextSetUser).toBe('Ошибка: fakeError');

        expect(logSpy).toHaveBeenCalledWith('Ошибка: fakeError');

      });

      test('Тест санка setUserThunk: rejected (without message)', async () => {

        (api.updateUserApi as jest.Mock) = jest.fn((user: api.TRegisterData) => Promise.reject('fakeError'));

        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        const fakeStore = configureStore({
          reducer: userSlice.reducer,
          preloadedState: initialStateTrue
        });

        await fakeStore.dispatch(setUserThunk(payloadUserData1));

        const state = fakeStore.getState();
        expect(state.isLoadingSetUser).toBe(false);
        expect(state.errorTextSetUser).toBe('Ошибка изменения данных пользователя');

        expect(logSpy).toHaveBeenCalledWith('Ошибка изменения данных пользователя');

      });

    });

  });

});
