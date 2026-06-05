// Don't remove parameters; complete them according to your profile.
// The roles will be used to filter the viewpoints you have access to by default.
// Your organisation, if it matches an organisation in the model, will also be used to configure some actions on the model.
var configuration={
name:"Doe",
firstname:"John",
title:"Mr",
roles:["enterprise-architect"],// a list of archimate roles
organisations:["myCompany"]
};
//alert(`
//Welcome to ArchiMateCG
//
//ArchiMateCG was launched with the configuration defined in config.js (Change it to fit to your profile)
//
//Person: ${configuration.title} ${configuration.firstname} ${configuration.name}
//Roles: ${JSON.stringify(configuration.roles)}
//Organisations: ${ JSON.stringify(configuration.organisations)}
//`);