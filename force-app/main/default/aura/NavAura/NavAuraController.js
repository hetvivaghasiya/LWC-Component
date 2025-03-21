({
    doInit: function(component, event, helper) {
        let action = component.get("c.checkLoginStatus");
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.isLoggedIn", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },

    handleLogout: function(component, event, helper) {
        localStorage.removeItem('isLoggedIn'); // Clear login session
        
        // Redirect to logout page for Communities
        let url = '/secur/logout.jsp';
        window.location.assign(url);
    },

    toggleMenu: function(component, event, helper) {
        let menu = component.find("menuCheckbox");
        $A.util.toggleClass(menu, "active");
    }
})
