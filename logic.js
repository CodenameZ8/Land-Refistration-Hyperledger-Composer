'use strict';


 function contractingInsurance( insurance ){
    return getAssetRegistry('org.acme.landregistry.Insurance')
      .then(function(assetRegistry){
      var factory = getFactory()
      var insuranceId = insurance.insured.id + '' + insurance.insuranceCompany.id + '' + insurance.realEstate.id
      var insuranceAsset = factory.newResource('org.acme.landregistry', 'Insurance', insuranceId)
      insuranceAsset.insured = insurance.insured
      insuranceAsset.insuranceCompany = insurance.insuranceCompany
      insuranceAsset.realEstate = insurance.realEstate
      insuranceAsset.durationInMonths = insurance.durationInMonths
      insuranceAsset.monthlyCost = insurance.monthlyCost
      
      return assetRegistry.add(insuranceAsset)
    })
 }


function contractingLoan( loan ){
  return getAssetRegistry('org.acme.landregistry.Loan')
    .then(function(assetRegistry){
    var factory = getFactory()
    var loanId = loan.debtor.id + '' + loan.realEstate.id + '' + loan.bank.id
    var loanAsset = factory.newResource('org.acme.landregistry', 'Loan', loanId) 
    loanAsset.debtor = loan.debtor
    loanAsset.bank = loan.bank
    loanAsset.interestRate = loan.interestRate
    loanAsset.durationInMonths = loan.durationInMonths
    loanAsset.realEstate = loan.realEstate
    loanAsset.amount = loan.realEstate.price
    
    return assetRegistry.add(loanAsset)
  })
}


function buyingRealEstate( trade ){
  trade.seller.balance += trade.realEstate.price
  
  if( trade.buyer.balance < totalCost ){
    throw new Error('Not enough funds to buy this!')
  }
  trade.buyer.balance -= totalCost
  trade.realEstate.owner = trade.buyer
  trade.realEstateAgent.balance += realEstateAgentFees
  trade.notary.balance += notaryFees
  
  Promise.all([
    getAssetRegistry('org.acme.landregistry.RealEstate'),
    getParticipantRegistry('org.acme.landregistry.PrivateIndividual'),
    getParticipantRegistry('org.acme.landregistry.PrivateIndividual'),
    getParticipantRegistry('org.acme.landregistry.Notary'),
    getParticipantRegistry('org.acme.landregistry.RealEstateAgent')
  ]).then(function(registries){
    return (
      registries[0].update(trade.realEstate),
      registries[1].update(trade.seller),
      registries[2].update(trade.buyer),
      registries[3].update(trade.notary),
      registries[4].update(trade.realEstateAgent)
    )
  })
}