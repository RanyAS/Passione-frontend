import {
  createEmptyMenuRegistrationForm,
  type MenuRegistrationForm,
} from "../../types/menu-registration";

let formState: MenuRegistrationForm = createEmptyMenuRegistrationForm();

export function getMenuRegistrationForm(): MenuRegistrationForm {
  return { ...formState, allergies: [...formState.allergies] };
}

export function setMenuRegistrationForm(form: MenuRegistrationForm) {
  formState = {
    ...form,
    allergies: [...form.allergies],
  };
}

export function resetMenuRegistrationForm() {
  formState = createEmptyMenuRegistrationForm();
}
