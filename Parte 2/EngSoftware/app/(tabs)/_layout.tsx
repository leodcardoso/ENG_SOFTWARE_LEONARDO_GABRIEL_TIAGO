import {Tabs, Stack} from 'expo-router';

export default function RootLayout() {
  return (
    <Tabs>
        <Tabs.Screen name="index" options={{title: 'Home'}} />
        <Tabs.Screen name="user" options={{title: 'User Page'}} />
        <Tabs.Screen name="product/[productId]" options={{title: 'Product Details'}} />
    </Tabs>
    );
}