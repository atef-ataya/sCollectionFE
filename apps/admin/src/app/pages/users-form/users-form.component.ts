import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UsersService, User } from '@bluebits/users';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';
import * as countriesLib from 'i18n-iso-countries';

declare const require: (arg0: string) => countriesLib.LocaleData;

@Component({
  selector: 'admin-users-form',
  templateUrl: './users-form.component.html',
  styles: [
  ]
})
export class UsersFormComponent implements OnInit {

  form: FormGroup = {} as FormGroup;
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  isSubmitted = false;
  editmode = false;
  currentUserId? : string ;
  countries:{ id: string; name: string; }[] =[];
  // formbuilder to build reactive form in angular we use it as service
  constructor(
    private messageService: MessageService, 
    private formBuilder: FormBuilder, 
    private usersService: UsersService,
    private location: Location,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this._initUserForm();
    this._checkEditMode();
    this._getCountries();
  }

  private _initUserForm(){
    this.form=this.formBuilder.group({
      name:['', Validators.required],
      password:['',Validators.required],
      email:['', [Validators.required, Validators.email]],
      phone:['', Validators.required],
      isAdmin:[false],
      street:[''],
      apartment:[''],
      zip:[''],
      city:[''],
      country:['']
    })
  }

  private _getCountries(){
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    countriesLib.registerLocale(require("i18n-iso-countries/langs/en.json"));
    this.countries = Object.entries(countriesLib.getNames('en', {select: 'official' })).map((entry) => {
     //console.log(entry[1]);
      return {
        id: entry[0],
        name: entry[1]
      }
    });
    console.log(this.countries);
  }

  onCancel(){
    this.location.back();
  }
  onSubmit(){
    this.isSubmitted = true;

    if(this.form.invalid){
      return;
    }
      const user : User = {
        id: this.currentUserId,
      name: this.userForm.name.value,
    };
    if(this.editmode) {
      this._updateUser(user)
    }else {
      this._addUser(user)
    }
    
  }

  get userForm(){
    return this.form.controls;
  }

  private _addUser(user: User) {
    this.usersService.createUser(user).subscribe(
      (user: User) => {
      this.messageService.add({
        severity:'success', 
        summary:'Success', 
        detail:`Category ${user.name} is Created!`});
      timer(1000)
      .toPromise()
      .then(() => {
        this.location.back();
      })
    },()=>{
      this.messageService.add({
        severity:'error', 
        summary:'Error', 
        detail:'Category is Not Created.'});
    })
  }

  private _updateUser(user: User) {
    this.usersService.updateUser(user).subscribe(
      () => {
      this.messageService.add({
        severity:'success', 
        summary:'Success', 
        detail:'User is Updated!'});
      timer(1000)
      .toPromise()
      .then(() => {
        this.location.back();
      })
    },()=>{
      this.messageService.add({
        severity:'error', 
        summary:'Error', 
        detail:'User is Not Updated.'
      });
    })
  }

  private _checkEditMode(){
    this.route.params.subscribe(params => {
      if(params.id){
        this.editmode = true;
        this.currentUserId = params.id;
        this.usersService.getUser(params.id).subscribe(user => {
          this.userForm.name.setValue(user.name);
          this.userForm.email.setValue(user.email);
          this.userForm.isAdmin.setValue(user.isAdmin);
          this.userForm.street.setValue(user.street);
          this.userForm.apartment.setValue(user.apartment);
          this.userForm.zip.setValue(user.zip);
          this.userForm.city.setValue(user.city);
          this.userForm.country.setValue(user.country)

          this.userForm.password.setValidators([]);
          this.userForm.password.updateValueAndValidity();
        })
      }
    })
  }
}
