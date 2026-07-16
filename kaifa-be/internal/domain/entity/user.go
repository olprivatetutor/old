package entity

type User struct {
	ID                      string `json:"id"`
	Email                   string `json:"email"`
	FullName                string `json:"full_name"`
	DOB                     string `json:"dob"`
	Gender                  string `json:"gender"`
	Role                    string `json:"role"`
	Class                   string `json:"class"`
	CurrentProficiencyLevel string `json:"current_proficiency_level"`
}
