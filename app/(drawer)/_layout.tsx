import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Drawer } from 'expo-router/drawer';



const DrawerLayout = () => {


    return (
        
        <Drawer>
        
            <Drawer.Screen
                name="index"
                
                options={{
                    headerShown: false,
                    drawerIcon: ({ size, color }) => <Ionicons name="home-outline" size={size} color={color} />,
                }}
            />
            <Drawer.Screen
                name="search"
                
                options={{
                    headerShown: false,
                    drawerIcon: ({ size, color }) => <Ionicons name="search" size={size} color={color} />,
                }}
            />
            

        </Drawer>
    );
}

export default DrawerLayout;
