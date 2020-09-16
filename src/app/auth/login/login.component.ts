import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/shared/services/auth/auth.service";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { NotifyService } from "src/app/shared/handler/notify/notify.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  // Image
  imgLogo = "assets/img/logo/petronasLogo.png";
  imgBg = "assets/img/default/bg-img-it.jpg";
  imgLogo2 = "assets/img/logo/loveLocalv2.png";
  imgQR = "assets/img/logo/qr petronas.png";

  // Form
  focusUsername;
  focusPassword;
  loginForm: FormGroup;
  loginFormMessages = {
    username: [
      { type: "required", message: "Email is required" },
      { type: "email", message: "Please enter a valid email" },
    ],
    password: [
      { type: "required", message: "Password is required" },
      {
        type: "minLength",
        message: "Password must have at least 8 characters",
      },
    ],
  };

  constructor(
    private authService: AuthService,
    private notifyService: NotifyService,
    private formBuilder: FormBuilder,
    private loadingBar: LoadingBarService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: new FormControl("", Validators.compose([Validators.required])),
      password: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(8)])
      ),
    });
  }

  login() {
    console.log(this.loginForm.value.username);

    this.successMessage();
    if (this.loginForm.value.username == "admin") {
      this.navigatePage("dashboard-admin");
    } else if (this.loginForm.value.username == "bus") {
      this.navigatePage("dashboard-bus");
    } else if (this.loginForm.value.username == "user") {
      this.navigatePage("dashboard-user");
    }

  }

  navigatePage(path: String) {
    if (path == "login") {
      return this.router.navigate(["/auth/login"]);
    } else if (path == "forgot") {
      return this.router.navigate(["/auth/forgot"]);
    } else if (path == "register") {
      return this.router.navigate(["/auth/register"]);
    } else if (path == "dashboard-admin") {
      return this.router.navigate(["/admin/dashboard"]);
    } else if (path == "dashboard-user") {
      return this.router.navigate(["/global/landing_page"]);
    } else if (path == "forecasts") {
      return this.router.navigate(["/admin/weapon/forecasts"]);
    } else if (path == "dashboard-bus") {
      return this.router.navigate(["/bus/dashboard"]);
    }
  }

  successMessage() {
    let title = "Log In";
    let message = "Logging in right now";
    this.notifyService.openToastr(title, message);
  }

  errorMessage() {
    let title = "Error";
    let message = "Wrong Username or password.Please Try Again";
    this.notifyService.openToastrHttp(title, message);
  }
}
