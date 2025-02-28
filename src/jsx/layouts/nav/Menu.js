import { SVGICON } from "../../constant/theme";

export const MenuList = [
    //Content
    {
        title: 'JBDS POWER',
        classsChange: 'menu-title'
    },

    //Lead Management
    {
        title: 'Lead Management',	
        classsChange: 'mm-collapse',
        // update:"New",
        iconStyle:SVGICON.User,
        content: [
            {
                title:"Lead",
                to:'/leads-list',
            },
          
            
        ],
    },
   // Dashboard
    {
        title: 'Dashboard',	
        classsChange: 'mm-collapse',		
        iconStyle: SVGICON.Home,
        content: [
            
            {
                title: 'Ticket Dashboard',
                to: '/',					
            },
            // {
            //     title: 'Dashboard Dark',
            //     to: '/dashboard-dark',
                
            // },            
        ],
    },
    // {   
    //     title:'Employees',
    //     iconStyle: SVGICON.Employe,
    //     to: '/employee',
    // },
    // {   
    //     title:'Core HR',
    //     iconStyle: SVGICON.CoreHr,
    //     to: '/core-hr',
    // },
    // {   
    //     title:'Finance',
    //     iconStyle: SVGICON.Finance,
    //     to: '/finance',
    // },
    //Ticket Process
    {
        title: 'Ticket Process',
        classsChange: 'mm-collapse',
        iconStyle: SVGICON.Task,
        content: [
            {
                title: 'Ticket List',
                to: 'ticket-list',
                iconStyle: SVGICON.List, // Add icons to match dashboard behavior
            },
            {
                title: "Manage Location",
                to: '/location-details',
                iconStyle: SVGICON.Map, // Add icons to match dashboard behavior
            },
            {
                title: 'Product',
                classsChange: 'mm-collapse',
                iconStyle: SVGICON.User, // Main icon for Product
                content: [
                    {
                        title: 'Product Details',
                        to: '/product-details',
                        iconStyle: SVGICON.Box, 
                    },
                    {
                        title: 'Tool Details',
                        to: '/tool-details',
                        iconStyle: SVGICON.Tools,
                    },
                    {
                        title: 'Manpower Details',
                        to: '/manpower-details',
                        iconStyle: SVGICON.People,
                    },
                    {
                        title: 'Safety Items',
                        to: '/safety-details',
                        iconStyle: SVGICON.Shield,
                    },
                    {
                        title: 'Customer Details',
                        to: '/customer-details',
                        iconStyle: SVGICON.UserCheck,
                    },
                ],
            },
            
        ],
    },
    
    
    // {   
    //     title:'Performance',
    //     iconStyle: SVGICON.Performance,
    //     to: '/performance',
    // },
    // {   
    //     title:'Projects',
    //     iconStyle: SVGICON.ProjectsSidbar,
    //     to: '/project',
    // },
	
    // {   
    //     title:'Reports',
    //     iconStyle: SVGICON.Reports,
    //     to: '/reports',
    // },
	
    // {   
    //     title:'Manage Clients',
    //     iconStyle: SVGICON.ManageClient,
    //     to: '/manage-client',
    // },
    // {   
    //     title:'Blog',
    //     // update:"New",
    //     iconStyle: SVGICON.Blog,
    //     to: '/blog-1',
    // },
    // {   
    //     title:'SVG Icons',   
    //     update:"New",   
    //     iconStyle: SVGICON.SvgPage,
    //     to: '/svg-icon',
    // },
	// {
    //     title: 'OUR FEATURES',
    //     classsChange: 'menu-title'
    // },
    //Apps
    {
        title: 'User Management',	
        classsChange: 'mm-collapse',
        // update:"New",
        iconStyle:SVGICON.User,
        content: [
            {
                title:"User",
                to:'/user',
            },

            // {
            //     title:'Add User',
            //     to:'/edit-profile'
            // },
            {
                title:'Roles',
                to:'/user-roles',
            },
            // {
            //     title:'Add Roles',
            //     to:'/add-role'
            // },

        
                
                // title: "Users Manager",
                // hasMenu : true,
                // // update:'New',
                // content: [
                //     {
                //         title:"User",
                //         to:'/user',
                //     },
                    // {
                    //     title:'Add User',
                    //     to:'/edit-profile'
                    // },
                    // {
                    //     title:'Roles Listing',
                    //     to:'/user-roles',
                    // },
                    // {
                    //     title:'Add Roles',
                    //     to:'/add-role'
                    // },
                    // {
                    //     title: 'Profile 1',
                    //     to: '/app-profile'
                    // },
                    // {
                    //     title: 'Profile 2',
                    //     to: '/app-profile-2'
                    // },
                    // {
                    //     title: 'Edit Profile',
                    //     to: 'edit-profile'
                    // },
                    // {
                    //     title: 'Post Details',
                    //     to: 'post-details'
                    // },
            //     ],
            // },
            // {
            //     title:'Customer Manager',
            //     hasMenu : true,
            //     // update:'New',
            //     content : [
            //         {
            //             title:'Customer',
            //             to:'/customer'
            //         },
            //         {
            //             title:'Customer Profile',
            //             to:'/customer-profile'
            //         },
            //     ],
            // },
            // {
            //     title:'Contacts',
            //     to: '/contacts',
            //     // update:"New"
            // },
            // {
            //     title: 'Email',
            //     hasMenu : true,
            //     content: [
            //         {
            //             title: 'Compose',
            //             to: 'email-compose',
            //         },
            //         {
            //             title: 'Index',
            //             to: 'email-inbox',
            //         },
            //         {
            //             title: 'Read',
            //             to: 'email-read',
            //         }
            //     ],
            // },
            // {
            //     title:'Calendar',
            //     to: 'app-calender'
            // },
           
            
            // {
            //     title: 'Shop',                
            //     hasMenu : true,
            //     content: [
            //         {
            //             title: 'Product Grid',
            //             to: 'ecom-product-grid',
            //         },
            //         {
            //             title: 'Product List',
            //             to: 'ecom-product-list',
            //         },
            //         {
            //             title: 'Product Details',
            //             to: 'ecom-product-detail',
            //         },
            //         {
            //             title: 'Order',
            //             to: 'ecom-product-order',
            //         },
            //         {
            //             title: 'Checkout',
            //             to: 'ecom-checkout',
            //         },
            //         {
            //             title: 'Invoice',
            //             to: 'ecom-invoice',
            //         },
            //         {
            //             title: 'Customers',
            //             to: 'ecom-customers',
            //         },
            //     ],
            // },
        ],
    },

    // {
    //     title: 'Product',	
    //     classsChange: 'mm-collapse',
    //     // update:"New",
    //     iconStyle:SVGICON.User,
        
    // },
    // {
    //     title: 'Tool',	
    //     classsChange: 'mm-collapse',
    //     update:"New",
    //     iconStyle:SVGICON.User,
        
    // },
    // {
    //     title: 'Manpower',	
    //     classsChange: 'mm-collapse',
    //     update:"New",
    //     iconStyle:SVGICON.User,
        
    // },
    // {
    //     title: 'Safety',	
    //     classsChange: 'mm-collapse',
    //     update:"New",
    //     iconStyle:SVGICON.User,
        
    // },
    // {
    //     title: 'Location',	
    //     classsChange: 'mm-collapse',
    //     update:"New",
    //     iconStyle:SVGICON.User,
        
    // },
    // {
    //     title: 'Customer',	
    //     classsChange: 'mm-collapse',
    //     update:"New",
    //     iconStyle:SVGICON.User,
        
    // },

   
]