import {
  ConstructorPage, NotFound404, Feed, Login, Register, ForgotPassword, ResetPassword, Profile, ProfileOrders
} from '@pages';
import '../../index.css';
import { Route, Routes, useNavigate} from "react-router-dom";
import { AppHeader, ProtectedRoute, Modal, IngredientDetails, OrderInfo } from '@components';
import { useLocation } from 'react-router';
import { useEffect } from 'react';
import { AppDispatch, useDispatch } from '../../services/store';
import { getIngredientsThunk } from '../../services/slices/ingredients-slice/ingredients-slice';
import { getUserThunk } from '../../services/slices/user-slice/user-slice';
import { getCookie } from '../../utils/cookie';


export default function App() {
  const location = useLocation();
  const backgroundLocation = location.state?.background?.pathname;
  const navigate = useNavigate();

  function handleCloseModal() {
    navigate(backgroundLocation);
  };

  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(getIngredientsThunk());

    if (getCookie('accessToken')) {
      dispatch(getUserThunk());
    } else {
      dispatch({type: 'user/reset'});
      console.log('Нет куки');
    }
  }, []);

  return (
    <>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path="*" element={<NotFound404 />} />
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" >
          <Route index element={<Feed />} />
          <Route path=":number" element={<OrderInfo />} />
        </Route>
        <Route path="/login" element={<ProtectedRoute loggedPrevent={true}><Login /></ProtectedRoute>} />
        <Route path="/register" element={<ProtectedRoute loggedPrevent={true}><Register /></ProtectedRoute>} />
        <Route path="/forgot-password" element={<ProtectedRoute loggedPrevent={true}><ForgotPassword /></ProtectedRoute>} />
        <Route path="/reset-password" element={<ProtectedRoute loggedPrevent={true}><ResetPassword /></ProtectedRoute>} />
        <Route path="/profile" >
          <Route index element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="orders" >
            <Route index element={<ProtectedRoute><ProfileOrders /></ProtectedRoute>} />
            <Route path=":number" element={<ProtectedRoute><OrderInfo /></ProtectedRoute>} />
          </Route>
        </Route>
        <Route path="/ingredients/:id" element={<IngredientDetails />} />
      </Routes>

      {backgroundLocation &&
        <Routes>
          <Route path="/feed/:number" element={
              <Modal title="Number" onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route path="/ingredients/:id" element={
              <Modal title="Детали ингредиента" onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route path="/profile/orders/:number" element={
              <ProtectedRoute>
                <Modal title="Number" onClose={handleCloseModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      }

    </>
  );
}
