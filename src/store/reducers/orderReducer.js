import {
    createSlice,
    createAsyncThunk
} from '@reduxjs/toolkit'
import axios from 'axios'
import {base_url} from '../../utils/config'

export const place_order = createAsyncThunk(
    'order/place_order',
    async ({
        price,
        products,
        shipping_fee,
        shippingInfo,
        userId,
        navigate,
        items
    },{getState}) => {
        const {token} =getState().auth
        const config = {
           headers: {
              Authorization: `Bearer ${token}`,
           },
        };
        try {
            const {
                data
            } = await axios.post(`${base_url}/api/home/order/place-order`, {
                price,
                products,
                shipping_fee,
                shippingInfo,
                userId,
                navigate,
                items,
            },config)
            navigate('/payment', {
                state: {
                    price: price + shipping_fee,
                    items,
                    orderId: data.orderId
                }
            })
            console.log(data)
            return true
        } catch (error) {
            console.log(error.response)
        }
    }
)

export const get_orders = createAsyncThunk(
    'order/get_orders',
    async ({
        customerId,
        status
    }, {
        rejectWithValue,
        fulfillWithValue,getState
    }) => {
        const {token} =getState().auth
        const config = {
           headers: {
              Authorization: `Bearer ${token}`,
           },
        };
        try {
            const {
                data
            } = await axios.get(`${base_url}/api/home/customer/gat-orders/${customerId}/${status}`,config)
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error.response)
        }
    }
)

export const get_order = createAsyncThunk(
    'order/get_order',
    async (orderId, {
        rejectWithValue,
        fulfillWithValue,getState
    }) => {
        const {token} =getState().auth
        const config = {
           headers: {
              Authorization: `Bearer ${token}`,
           },
        };
        try {
            const {
                data
            } = await axios.get(`${base_url}/api/home/customer/gat-order/${orderId}`,config)
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error.response)
        }
    }
)

export const orderReducer = createSlice({
    name: 'order',
    initialState: {
        myOrders: [],
        errorMessage: '',
        successMessage: '',
        myOrder: {}
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ''
            state.successMessage = ''
        }
    },
    extraReducers: {
        [get_orders.fulfilled]: (state, {
            payload
        }) => {
            state.myOrders = payload.orders
        },
        [get_order.fulfilled]: (state, {
            payload
        }) => {
            state.myOrder = payload.order
        }
    }
})

export const {
    messageClear
} = orderReducer.actions
export default orderReducer.reducer