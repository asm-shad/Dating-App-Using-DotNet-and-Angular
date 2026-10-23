import { Component, inject, output, signal } from '@angular/core';
import { RegisterCreds } from '../../../types/user';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../../../core/services/account-service';
import { TextInput } from "../../../shared/text-input/text-input";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TextInput],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  protected registerCreds = {} as RegisterCreds;
  regesterationState = output<boolean>();
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  protected credentialsForm: FormGroup;
  protected profileForm: FormGroup;
  protected currentStep = signal(1);
  protected validationErrors = signal<string[]>([]);
  protected router = inject(Router);

  constructor() {
    this.credentialsForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
    });
    this, this.credentialsForm.controls['password'].valueChanges.subscribe(() => {
      this.credentialsForm.controls['confirmPassword'].updateValueAndValidity();
    });

    this.profileForm = this.fb.group(
      {
        gender: ['male', Validators.required],
        dateOfBirth: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
      }
    )
  }


  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;
      if (!parent) return null;

      const matchValue = parent.get(matchTo)?.value;
      return control.value === matchValue ? null : { passwordMismatch: true }
    }
  }

  nextStep() {
    if (this.credentialsForm.valid) {
      this.currentStep.update(prevStep => prevStep + 1);
    }
  }

  prevStep() {
    if (this.credentialsForm.valid) {
      this.currentStep.update(prevStep => prevStep - 1);
    }
  }

  getMaxDate() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  }

  register() {

    if (this.profileForm.valid && this.credentialsForm.valid) {
      const formData = { ...this.profileForm.value, ...this.credentialsForm.value };
      this.accountService.register(formData).subscribe(
        {
          next: output => {
            console.log(output),
              this.router.navigateByUrl('/members');
          },
          error: err => {
            console.error(err);
            this.validationErrors.set(err);
          }
        }
      )
    }

  }

  cancel() {
    this.regesterationState.emit(false);
  }
}
