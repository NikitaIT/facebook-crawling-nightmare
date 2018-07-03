type Gender = "Mail"|"Female"|"Custom";
type InterestedIn = "Women"| "Men";

type Contact = {
	MobilePhones : string
	Address:{
		Address: string
		CityOrTown: string //Saint Petersburg, Russia
		Zip: string
	}
	Neighborhood: string
	Email: string
	Phones: {
		type: "Home"|"Work" 
		value: string
	}[]
}

type BasicInfo = {
	BirthDate: Date
	BirthYear: number
	NameDay: Date
	Gender: Gender
	InterestedIn: InterestedIn
	Languages: string[]
	ReligiousViews: {ReligiousViews: string, Description: Text}
	PoliticalViews: {PoliticalViews: string, Description: Text}
}

type ContactandBasicInfo = Contact & BasicInfo