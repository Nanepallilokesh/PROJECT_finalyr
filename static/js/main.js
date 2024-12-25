(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });


    
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


   


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: true,
        loop: true,
    });
    
})(jQuery);



function showModal() {
    document.getElementById('loginModal').style.display = 'block';
    showLogin(); // Show login form by default
}

function closeModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function showLogin() {
    // Replace modal content with login form
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `
        <span class="close" onclick="closeModal()">&times;</span>
        <h2>Login</h2>
        <form method="POST" action="/Login">
            <!-- Username input box -->
            <div class="input_box">
                
                <input type="text" id="username" name="username" placeholder="Enter username" required />
            </div>

            <!-- User type input box -->
            <label for="user_type" style="color:black;">User Type:</label>
            <select name="user_type" required>
                <option value="donor">Donor</option>
                <option value="hospital_admin">Hospital Admin</option>
            </select><br>

            <!-- Password input box -->
            <div class="input_box">
                <div class="password_title">
                </div>
                <input type="password" id="password" name="password" placeholder="Enter your password" required />
            </div>

           
            <!-- Login button -->
            <button type="submit" style="background-color:skyblue;">Log In</button>

            <!-- Sign Up Link -->
            <p class="sign_up">Don't have an account? <a onclick="showRegister()" style="color:blue">Sign Up</a></p>
        </form>
    `;
}

function showRegister() {
    // Replace modal content with registration form
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `
        <span class="close" onclick="closeModal()">&times;</span>
        <h2>Register</h2>
        <div style="overflow-y: auto;">
        <form method="POST" action="/Register">
            <input type="text" name="username" placeholder="Enter Username" required>
            <input type="email" name="email" placeholder="Enter Email" required>
            <input type="text" name="phone_number" placeholder="Enter Phone Number" required>
            <input type="text" name="city" placeholder="Enter City" required>
            <input type="text" name="blood_group" placeholder="Enter Blood Group" required>
            <input type="password" name="password" placeholder="Enter Password" required>
            <input type="password" name="re_password" placeholder="Re-enter Password" required>
            <button type="submit" style="background-color:skyblue;">Register Now</button>
        </form>
        </div>
        <p>Already have an account? <a onclick="showLogin()" style="color:blue">Login</a></p>
    `;
}
