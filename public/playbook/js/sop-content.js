(function () {
  const facebookSessionsUrl = 'https://www.facebook.com/ put uid here /allactivity?activity_history=false&category_key=ACTIVESESSIONS&manage_mode=false&should_load_landing_page=false';
  const businessUsersUrl = 'https://business.facebook.com/latest/settings/business_users?business_id=BUSINESS_ID';

  window.IN_SITE_SOPS = {
    'securing-profiles': `
      <h2>Securing your Facebook Setup</h2>
      <p>Before doing the rest, make sure to follow this warm up rule:</p>
      <blockquote>
        <p>“Don’t do any activity for 6 hours. After that time span, you can do a minimal activity by scrolling around, then leave the account. Making a lot of activities on a new browser will trigger suspicious activity. Also check if any phone numbers are associated with the profile, if there are, delete those phone numbers as it may avoid future WhatsApp verification errors.</p>
        <p>In no case should you like, repost, join groups, or add friends. This can trigger a check.”</p>
      </blockquote>
      <p>There are 3 basic layers that determine how secure your setup is. These are the security of the profiles, the Antidetect browser login information that you may have shared with us, as well as the BMs. You need to secure both before you do any serious advertising. Otherwise, you must accept the risk of getting hacked.</p>
      <p>Make sure you have done everything mentioned in this document, otherwise you can consider all of your profiles and BMs forfeit.</p>

      <h3>How to secure your profiles?</h3>
      <p>Profiles have 3 elements to their security. The email they are mainly attached to, the 2FA and the password.</p>
      <p>Please wait a few days before attempting password change on the Facebook profile.<br>If the profile comes with an @outlook or @hotmail then you must secure the email itself also.</p>
      <p>It is important that you have changed the 2FA or password at minimum. Preferably both, if possible. It is also important to change the password of the associated email (generally Outlook, but may differ).</p>
      <p>When changing the 2FA make sure to save the 2FA token you generated.</p>
      <p>Also make sure that no other person is logged into the account from another browser. You can check that here:<br><a href="${facebookSessionsUrl}" target="_blank" rel="noopener">${facebookSessionsUrl}</a></p>
      <p>Check the tab Where you’re logged in, as well as log in activity.</p>
      <p>You must make sure that there is no other session but yours, and this must be double-checked if you have changed your password. The most common and dangerous way of hacking is through session hijacking.</p>
      <p>You can avoid this by:</p>
      <ol>
        <li>Making sure you log out of all devices after changing the password. You will usually get the option when changing the password itself. Also log out from the Recognized Devices tab.</li>
        <li>Make sure no one has access to your Facebook profile in your AdsPower, except people you 110% trust not to hurt you.</li>
        <li>Making sure that we at Obsidian cannot randomly access your AdsPower. If you do give us access, the best way is by making a specific profile user for $5 a month, and only give it access to what actually needs to be accessed.</li>
        <li>Once someone from the Obsidian Team has accessed your profiles or had access to a profile, change the password and reset the sessions. This ensures that no one from Obsidian could even theoretically steal your profile.</li>
      </ol>
      <p>We will never hack you on purpose, however the Obsidian team is large and it is best to take precaution in case of an Obsidian staff member gone rogue.</p>
      <p>Not all profiles can change their password immediately due to limitations by Facebook. In that case change the 2FA. If that is not possible, secure the email at the very least.</p>
      <p>Usually we will replace a profile if password change is not possible.</p>
      <p>Another thing that you should do is remove any phone number from the profile. You can go to the account center and remove any associated phone numbers with the profile.</p>

      <h3>Securing emails</h3>
      <p>Beyond the profile, sometimes it also comes with an email that can also be secured. This is unfortunately not always the case, but when a profile comes with a Hotmail/Outlook, please work on securing that email too.</p>

      <h3>How to secure your BMs? (VERY IMPORTANT)</h3>
      <p>When someone gets hacked and their ad account siphoned by a malicious actor, it is usually because there is still a profile attached to that BM that you do not recognize. This is especially important, because some of these accounts are from unknown individuals.</p>
      <p>You can find the profiles that have access to the BM by going to the navigation bar on the left and clicking Users. You will see a bunch of user profiles that have access to the BM including your own.</p>
      <p>Delete the profiles that you do not recognize. Sometimes you will not be able to delete a profile because Facebook will tell you that you are too new of a user and/or the profile in question is the actual owner of the BM.</p>
      <p>In that case you can either wait for the error to disappear, or you can tag us and request we remove the profiles.</p>
      <p>Once you deleted all the profiles you do not recognize, double check with this link:<br><a href="${businessUsersUrl}" target="_blank" rel="noopener">${businessUsersUrl}</a></p>
      <p>Business ID refers to the Business Manager ID. You can see this by checking the URL bar in the business settings. It is a long string of numbers.</p>

      <h3>Securing AdsPower once setup is finished.</h3>
      <p>If you took the DFY setup then we probably have access to your AdsPower. Once you are actually advertising, it is smart to enable 2FA/OTP again so that Obsidian Assets staff cannot access your accounts with malicious intentions.</p>
      <p>Obviously, we do not have these malicious intentions. But if one of our team members decides to do something like that, they theoretically could, so as to avoid that, you should secure your AdsPower.</p>
      <p>Only do this when your setup is completely finished and you’re finally advertising without issue, so we don’t have to go back and forth about this.</p>
      <p>This is not really necessary since the risk is extremely small (less than 0.1% chance of this even happening). More than likely we would access your AdsPower to help you, but if you are running big numbers this might be worth doing as well.</p>

      <h3>Checking your own Facebook accounts periodically</h3>
      <p>You should check your own profiles once in a while, to see if you still have access to them. There is an extremely small chance of them getting hacked (if they are not farmed accounts).</p>
      <p>A profile that was initially yours and got hacked later may have access to your ad accounts. So it is important to periodically check whether you still have access.</p>
      <p>If the account is disabled, this is not a risk beyond losing the BM in of itself.</p>
      <p>Make sure that disabled profiles are also removed from your BM.</p>
      <p>Your profile might have gotten disabled at some point, one way or another. To avoid getting hacked through a profile that you ditched, you’ll need to also remove this profile from a BM.</p>
      <p>We once had a client who did not proceed with the Video Selfie Verification and just thought the profile is disabled. They removed the profile from their AdsPower structure, but did not bother to actually remove the profile from the BM.</p>
      <p>After a few months, someone else got access to the profile and hacked the client. So please keep in mind that this is possible.</p>

      <h3>Summary of how you can get hacked</h3>
      <p>You can get hacked one of the following ways:</p>
      <ol>
        <li>Through BM Access alone
          <ol>
            <li>This can be done through a profile from the original Supplier/BM Owner
              <ol><li>This can be avoided by deleting other profiles that have BM access</li></ol>
            </li>
            <li>This can be done by one of your own profiles
              <ol><li>This can either be done by a profile you ditched</li><li>Or this can be done with one of your active profiles</li></ol>
            </li>
          </ol>
        </li>
        <li>Through one of your own profiles
          <ol><li>Obviously your own profiles have access to the BM, but this is the other main way of getting hacked, and this can be done several ways by the hacker.
            <ol><li>The most egregious and overlooked way of getting hacked is by Session Hijacking. How to avoid this is mentioned earlier in the document.</li><li>You did not secure your profile and it got hacked by someone else knowing the credentials</li></ol>
          </li></ol>
        </li>
        <li>Your staff (or Obsidian staff) abused your AdsPower
          <ol>
            <li>Someone from your team maliciously messes with your ad spend
              <ol><li>They can do it with your AdsPower, using your actual AdsPower profile</li><li>They take the cookies from your profile, and do a session hijack</li><li>You can take precaution by demanding a copy of the ID from whoever you are hiring that will manage your FB accounts</li></ol>
            </li>
            <li>Someone from the Obsidian team can also theoretically do this
              <ol><li>This is why a Team Member profile with limited access is recommended for Obsidian</li><li>It is recommended to at least add 2FA when the DFY is done and Obsidian is done with your structure. We should never have access to your AdsPower unless it is for a specific reason.</li></ol>
            </li>
          </ol>
        </li>
      </ol>`,

    'securing-profiles-dutch': `
      <h2>Je Facebook-setup beveiligen</h2>
      <p>Voordat je de rest uitvoert, moet je deze opwarmregel volgen:</p>
      <blockquote>
        <p>“Voer gedurende 6 uur geen enkele activiteit uit. Na die periode kun je minimale activiteit vertonen door wat rond te scrollen en het account daarna weer te verlaten. Veel activiteiten uitvoeren in een nieuwe browser zal verdachte activiteit activeren. Controleer ook of er telefoonnummers aan het profiel zijn gekoppeld. Als dat zo is, verwijder die telefoonnummers, omdat dit toekomstige fouten bij WhatsApp-verificatie kan voorkomen.</p>
        <p>Je mag in geen geval berichten liken of opnieuw plaatsen, lid worden van groepen of vrienden toevoegen. Dit kan een controle activeren.”</p>
      </blockquote>
      <p>Er zijn 3 basislagen die bepalen hoe veilig je setup is. Dit zijn de beveiliging van de profielen, de inloggegevens van de antidetect-browser die je mogelijk met ons hebt gedeeld, en de BM's. Je moet beide beveiligen voordat je serieus gaat adverteren. Anders moet je het risico accepteren dat je wordt gehackt.</p>
      <p>Zorg ervoor dat je alles hebt uitgevoerd wat in dit document wordt genoemd. Anders kun je ervan uitgaan dat al je profielen en BM's verloren zijn.</p>

      <h3>Hoe beveilig je je profielen?</h3>
      <p>Profielen hebben 3 beveiligingselementen: het e-mailadres waaraan ze primair zijn gekoppeld, de 2FA en het wachtwoord.</p>
      <p>Wacht een paar dagen voordat je probeert het wachtwoord van het Facebook-profiel te wijzigen.<br>Als het profiel met een @outlook- of @hotmail-adres wordt geleverd, moet je ook het e-mailaccount zelf beveiligen.</p>
      <p>Het is belangrijk dat je minimaal de 2FA of het wachtwoord hebt gewijzigd. Bij voorkeur beide, als dat mogelijk is. Het is ook belangrijk om het wachtwoord van het gekoppelde e-mailaccount te wijzigen (doorgaans Outlook, maar dit kan verschillen).</p>
      <p>Wanneer je de 2FA wijzigt, moet je de gegenereerde 2FA-token goed bewaren.</p>
      <p>Zorg er ook voor dat niemand anders via een andere browser op het account is ingelogd. Je kunt dat hier controleren:<br><a href="${facebookSessionsUrl}" target="_blank" rel="noopener">${facebookSessionsUrl}</a></p>
      <p>Controleer zowel het tabblad Waar je bent aangemeld als de aanmeldactiviteit.</p>
      <p>Je moet er zeker van zijn dat er geen andere sessie actief is dan die van jou. Controleer dit nogmaals als je je wachtwoord hebt gewijzigd. De meest voorkomende en gevaarlijkste manier van hacken is sessiekaping.</p>
      <p>Je kunt dit voorkomen door:</p>
      <ol>
        <li>Ervoor te zorgen dat je na het wijzigen van het wachtwoord op alle apparaten uitlogt. Meestal krijg je deze optie tijdens het wijzigen van het wachtwoord. Log ook uit via het tabblad Herkende apparaten.</li>
        <li>Ervoor te zorgen dat niemand toegang heeft tot je Facebook-profiel in AdsPower, behalve mensen van wie je voor 110% zeker weet dat ze je niet zullen benadelen.</li>
        <li>Ervoor te zorgen dat wij bij Obsidian niet zomaar toegang hebben tot je AdsPower. Als je ons wel toegang geeft, kun je het beste voor $5 per maand een specifieke profielgebruiker aanmaken en die alleen toegang geven tot wat daadwerkelijk nodig is.</li>
        <li>Zodra iemand van het Obsidian-team je profielen heeft geopend of toegang tot een profiel heeft gehad, wijzig je het wachtwoord en reset je de sessies. Zo zorg je ervoor dat niemand van Obsidian je profiel zelfs maar in theorie zou kunnen stelen.</li>
      </ol>
      <p>We zullen je nooit opzettelijk hacken. Het Obsidian-team is echter groot en het is verstandig voorzorgsmaatregelen te nemen voor het geval een medewerker van Obsidian kwaadwillend handelt.</p>
      <p>Door beperkingen van Facebook kan niet bij elk profiel het wachtwoord direct worden gewijzigd. Wijzig in dat geval de 2FA. Als dat ook niet mogelijk is, beveilig dan op zijn minst het e-mailaccount.</p>
      <p>Meestal vervangen we een profiel als het wijzigen van het wachtwoord niet mogelijk is.</p>
      <p>Daarnaast moet je alle telefoonnummers uit het profiel verwijderen. Ga naar het Accountcentrum en verwijder alle telefoonnummers die aan het profiel zijn gekoppeld.</p>

      <h3>E-mailaccounts beveiligen</h3>
      <p>Naast het profiel wordt er soms een e-mailaccount meegeleverd dat eveneens kan worden beveiligd. Helaas is dit niet altijd het geval, maar als een profiel met een Hotmail-/Outlook-account wordt geleverd, beveilig dat e-mailaccount dan ook.</p>

      <h3>Hoe beveilig je je BM's? (ZEER BELANGRIJK)</h3>
      <p>Wanneer iemand wordt gehackt en een kwaadwillende zijn advertentieaccount leegtrekt, komt dat meestal doordat er nog een profiel aan die BM is gekoppeld dat diegene niet herkent. Dit is extra belangrijk omdat sommige van deze accounts van onbekende personen zijn.</p>
      <p>Je vindt de profielen met toegang tot de BM door in de navigatiebalk aan de linkerkant op Gebruikers te klikken. Daar zie je meerdere gebruikersprofielen die toegang hebben tot de BM, waaronder je eigen profiel.</p>
      <p>Verwijder de profielen die je niet herkent. Soms kun je een profiel niet verwijderen, omdat Facebook aangeeft dat je als gebruiker te nieuw bent en/of dat het betreffende profiel de daadwerkelijke eigenaar van de BM is.</p>
      <p>In dat geval kun je wachten tot de fout verdwijnt, of ons taggen en vragen de profielen te verwijderen.</p>
      <p>Nadat je alle onbekende profielen hebt verwijderd, controleer je dit nogmaals via deze link:<br><a href="${businessUsersUrl}" target="_blank" rel="noopener">${businessUsersUrl}</a></p>
      <p>Business ID verwijst naar de Business Manager-ID. Je vindt deze door de URL-balk in de bedrijfsinstellingen te bekijken. Het is een lange reeks cijfers.</p>

      <h3>AdsPower beveiligen nadat de setup is voltooid.</h3>
      <p>Als je voor de DFY-setup hebt gekozen, hebben we waarschijnlijk toegang tot je AdsPower. Zodra je daadwerkelijk adverteert, is het verstandig 2FA/OTP opnieuw in te schakelen, zodat medewerkers van Obsidian Assets niet met kwaadwillende bedoelingen bij je accounts kunnen.</p>
      <p>Uiteraard hebben wij die kwaadwillende bedoelingen niet. Maar als een van onze teamleden besluit zoiets te doen, zou dat in theorie kunnen. Om dat te voorkomen, moet je je AdsPower beveiligen.</p>
      <p>Doe dit pas wanneer je setup volledig is afgerond en je eindelijk zonder problemen adverteert, zodat we hierover niet steeds heen en weer hoeven te schakelen.</p>
      <p>Dit is niet echt noodzakelijk, omdat het risico extreem klein is (minder dan 0,1% kans dat dit überhaupt gebeurt). Waarschijnlijker is dat we je AdsPower openen om je te helpen, maar als je met grote bedragen werkt, kan dit toch de moeite waard zijn.</p>

      <h3>Je eigen Facebook-accounts periodiek controleren</h3>
      <p>Controleer je eigen profielen af en toe om te zien of je er nog toegang toe hebt. De kans dat ze worden gehackt is uiterst klein (als het geen gefarmde accounts zijn).</p>
      <p>Een profiel dat oorspronkelijk van jou was en later is gehackt, kan toegang hebben tot je advertentieaccounts. Daarom is het belangrijk periodiek te controleren of je nog toegang hebt.</p>
      <p>Als het account is uitgeschakeld, vormt dit geen risico behalve het verlies van de BM zelf.</p>
      <p>Zorg ervoor dat uitgeschakelde profielen ook uit je BM worden verwijderd.</p>
      <p>Je profiel kan op enig moment om welke reden dan ook zijn uitgeschakeld. Om te voorkomen dat je wordt gehackt via een profiel dat je niet meer gebruikt, moet je dit profiel ook uit een BM verwijderen.</p>
      <p>We hadden ooit een klant die de Video Selfie Verification niet uitvoerde en er gewoon van uitging dat het profiel was uitgeschakeld. De klant verwijderde het profiel uit de AdsPower-structuur, maar nam niet de moeite het profiel daadwerkelijk uit de BM te verwijderen.</p>
      <p>Na een paar maanden kreeg iemand anders toegang tot het profiel en hackte de klant. Houd er dus rekening mee dat dit mogelijk is.</p>

      <h3>Samenvatting van de manieren waarop je gehackt kunt worden</h3>
      <p>Je kunt op een van de volgende manieren worden gehackt:</p>
      <ol>
        <li>Alleen via toegang tot de BM
          <ol>
            <li>Dit kan via een profiel van de oorspronkelijke leverancier/BM-eigenaar
              <ol><li>Dit kun je voorkomen door andere profielen met toegang tot de BM te verwijderen</li></ol>
            </li>
            <li>Dit kan via een van je eigen profielen
              <ol><li>Dit kan een profiel zijn dat je niet meer gebruikt</li><li>Of een van je actieve profielen</li></ol>
            </li>
          </ol>
        </li>
        <li>Via een van je eigen profielen
          <ol><li>Je eigen profielen hebben uiteraard toegang tot de BM. Dit is de andere belangrijke manier waarop je kunt worden gehackt en een hacker kan dit op verschillende manieren doen.
            <ol><li>De ernstigste en meest over het hoofd geziene manier om gehackt te worden is sessiekaping. Eerder in dit document staat hoe je dit voorkomt.</li><li>Je hebt je profiel niet beveiligd en het is gehackt door iemand die de inloggegevens kende</li></ol>
          </li></ol>
        </li>
        <li>Je medewerkers (of medewerkers van Obsidian) hebben misbruik gemaakt van je AdsPower
          <ol>
            <li>Iemand uit je team knoeit met kwade bedoelingen met je advertentie-uitgaven
              <ol><li>Diegene kan dit via je AdsPower doen met je daadwerkelijke AdsPower-profiel</li><li>Diegene neemt de cookies uit je profiel over en voert een sessiekaping uit</li><li>Je kunt voorzorgsmaatregelen nemen door een kopie van het identiteitsbewijs te eisen van iedereen die je inhuurt om je Facebook-accounts te beheren</li></ol>
            </li>
            <li>Iemand uit het Obsidian-team zou dit in theorie ook kunnen doen
              <ol><li>Daarom wordt voor Obsidian een Team Member-profiel met beperkte toegang aanbevolen</li><li>Het wordt aanbevolen om in ieder geval 2FA toe te voegen wanneer de DFY is afgerond en Obsidian klaar is met je structuur. We horen nooit toegang tot je AdsPower te hebben, tenzij daar een specifieke reden voor is.</li></ol>
            </li>
          </ol>
        </li>
      </ol>`,
    'common-issues': `
      <h2>Common Issues</h2>
      <p>This document goes over a whole host of issues that you may experience while using Facebook for business purposes. This document is regularly updated by the Obsidian Assets team.</p>
      <p>If you need support with Facebook or want to buy assets for Facebook, visit our Discord server and make a ticket: <a href="https://discord.gg/mFRKgQ2DS7" target="_blank" rel="noopener">https://discord.gg/mFRKgQ2DS7</a></p>

      <h3>How to change language?</h3>
      <p><a href="https://www.facebook.com/settings?tab=language" target="_blank" rel="noopener">Open Facebook language settings</a>.</p>

      <h3>How to log in to email?</h3>
      <p>Go to <a href="https://outlook.live.com/" target="_blank" rel="noopener">https://outlook.live.com/</a>.</p>

      <h3>How to log in to temporary email?</h3>
      <p>See the Fviainboxes, Moakt, and Inboxes.com sections below.</p>

      <h3>How to change an email password?</h3>
      <p>Go to <a href="https://account.live.com/password/change" target="_blank" rel="noopener">https://account.live.com/password/change</a>.</p>

      <h3>Facebook is showing an email address I don’t have access to</h3>
      <p>Facebook now requires multiple emails per profile, so virtual emails are added. The second email needs 30 days before it can receive verification codes. Until then, it cannot be removed. Wait the full 30-day period before making changes.</p>
      <h4>For a drmail address</h4>
      <p>Access the email on moakt.com. Fviainboxes.com is now the better option.</p>
      <ol><li>Click a random address.</li><li>Click the pen icon.</li><li>Edit the address to match the one shown on Facebook.</li><li>If the mail has not arrived, click refresh list.</li></ol>
      <p><strong>Note:</strong> You can change the drmail email from the BM’s Business Info in the left-side panel.</p>
      <h4>For fviainboxes.com, fviadropinbox.com, fviamail.work, or dropinboxes.com</h4>
      <ol><li>Go to <a href="https://fviainboxes.com" target="_blank" rel="noopener">https://fviainboxes.com</a>.</li><li>Enter the email address shown on your BM. Click the domain box to change email domains.</li><li>Click “Get Email”.</li></ol>

      <h3>Unable to join the BM because “Something went wrong”</h3>
      <p>This may be caused by a restricted profile or Business Manager.</p>
      <ol><li>Open <a href="https://business.facebook.com/business-support-home" target="_blank" rel="noopener">Business Support Home</a> on both the inviter’s and invitee’s accounts.</li><li>Check which account has a restriction.</li><li>If neither has a restriction, send the invitation again.</li></ol>

      <h3>Facebook asks for extra approval from an unavailable admin</h3>
      <ol><li>Access one of your other admins.</li><li>Go to “Requests”, then “Other requests”.</li><li>Handle the request with that admin.</li></ol>
      <p>If your other profiles are locked or disabled, mention us in chat and provide the BM ID.</p>

      <h3>Facebook is asking for 2FA</h3>
      <p>Follow the “2FA Authentication Required” section below.</p>

      <h3>Unable to assign a dataset to another BM</h3>
      <p>Assign the partner in the Partners section.</p>

      <h3>I cannot see my page invite</h3>
      <p>Open notifications on facebook.com. We always send page invitations.</p>

      <h3>I cannot see my pages</h3>
      <p>Assign one page to each employee.</p>
      <ol><li>Open any admin of the Main BM.</li><li>Go to <a href="https://business.facebook.com/latest/settings/business_info" target="_blank" rel="noopener">Business Info</a>.</li><li>Choose Accounts → Pages.</li><li>Select the page.</li><li>Choose Assign people and assign it to your employee.</li><li>Assign the other page to your other employee.</li><li>Open the employee profile in AdsPower and switch to the assigned page.</li></ol>

      <h3>I cannot see the ad account when running ads</h3>
      <ol><li>Open any admin of the Main BM.</li><li>Go to <a href="https://business.facebook.com/latest/settings/business_info" target="_blank" rel="noopener">Business Info</a>.</li><li>Choose Accounts → Ad accounts.</li><li>Select the agency ad account.</li><li>Choose Assign people and assign it to your employee.</li></ol>

      <h3>I cannot see my pixel or dataset when running ads</h3>
      <p>The dataset must be assigned to the employee profiles, and the ad account must be connected to the dataset.</p>
      <ol><li>Open any admin of the Main BM.</li><li>Go to <a href="https://business.facebook.com/latest/settings/business_info" target="_blank" rel="noopener">Business Info</a>.</li><li>Choose Data Sources → Datasets.</li><li>Select your pixel or dataset.</li><li>Choose Assign people and assign it to your employees.</li><li>Choose Connect assets and assign it to your ad account.</li></ol>

      <h3>Ads ask for a credit card and show a different currency</h3>
      <p>Always run ads with the agency’s ad account, not a regular profile. Switch the ad account in Ads Manager.</p>

      <h3>Beneficiary and payer information is required</h3>
      <p>You can enter anything, but use the same information consistently.</p>

      <h3>I cannot change my Facebook profile password</h3>
      <p>Change your Facebook or Meta password securely.</p>
      <ul><li>Method 1: <a href="https://www.facebook.com/privacy/review/?review_id=573933453011661" target="_blank" rel="noopener">Facebook Privacy Review</a>.</li><li>Method 2: Settings &amp; privacy → Settings → Accounts Center → Security checkup.</li></ul>
      <p>Do not click “Forgot password” from a new IP; it can easily lock the profile. Change passwords 2 days or 15 days after use.</p>
      <p>To keep the account safe, change the Facebook password, sign out of all old devices, change the email password, and change the email recovery address.</p>

      <h3>The BM link is already accepted or expired</h3>
      <p>The link may already have been used.</p>
      <ol><li>Get a random email address at <a href="https://fviainboxes.com/" target="_blank" rel="noopener">https://fviainboxes.com/</a>.</li><li>Send a new invitation to that address.</li></ol>
      <p>A BM should have 2–3 admin profiles. Keep backup admins available.</p>

      <h3>I cannot select page boost when posting</h3>
      <p>Publish the post first. The boost option appears after publication.</p>

      <h3>Page-backed Instagram accounts are not supported for Threads</h3>
      <p>Threads placement was selected accidentally. Remove Threads from the ad set placements.</p>

      <h3>Business Manager is banned or restricted</h3>
      <p>Mention us in Discord and provide your BM ID to start the unbanning process. The fee is 100 euros. You can try to unban it yourself, but if that attempt fails, the BM becomes completely unrecoverable.</p>

      <h3>Profile requires video verification</h3>
      <p>Check the video selfie verification guide or ask in the Discord server.</p>

      <h3>Facebook requires security steps</h3>
      <ol><li>Press “Start Security Steps”.</li><li>Enter the email attached to the profile to receive the verification code.</li><li>Follow the prompts and change your password.</li></ol>

      <h3>Automated behavior warning</h3>
      <p>Press dismiss. Facebook is detecting bot-like actions such as rapid liking, commenting, or other activity.</p>

      <h3>Fviainboxes</h3>
      <p>Recovery and backup emails using fviainboxes.com can be accessed at <a href="https://fviainboxes.com" target="_blank" rel="noopener">https://fviainboxes.com</a>.</p>
      <ol><li>Enter your address in the first box.</li><li>Click “Get Email”.</li></ol>

      <h3>Inboxes.com</h3>
      <p>Use inboxes.com for these recovery email domains:</p>
      <p>blondmail.com, chapsmail.com, clownmail.com, dropjar.com, fivermail.com, getairmail.com, getmule.com, getnada.com, gimpmail.com, givmail.com, guysmail.com, inboxbear.com, replyloop.com, robot-mail.com, spicysoda.com, tafmail.com, temptami.com, tupmail.com, vomoto.com</p>
      <ol><li>Click “Add inbox”.</li><li>Enter the address, then click “Add inbox”.</li><li>Click refresh until the mail arrives.</li></ol>

      <h3>2FA Authentication Required</h3>
      <ol><li>When entering Business Manager, press “Secure my account”.</li><li>Select your profile.</li><li>Choose Authentication App, then Continue.</li><li>Save the 2FA secret Facebook displays in a screenshot or secure notes.</li><li>Go to <a href="https://gauth.apps.gbraad.nl/" target="_blank" rel="noopener">https://gauth.apps.gbraad.nl/</a> and click add.</li><li>Enter any account name.</li><li>Paste the 2FA secret from Facebook into Secret key.</li></ol>

      <h3>How to invite admin and employee profiles</h3>
      <ol><li>Go to Business Manager and click Invite People.</li><li>Open <a href="https://fviainboxes.com" target="_blank" rel="noopener">https://fviainboxes.com</a> and enter a random address.</li><li>Copy the email.</li><li>Return to BM, paste the email, and click Next.</li><li>For admin profiles, do not grant full control immediately. Change to full control after at least one hour. Employee profiles do not need full control.</li><li>Continue to the final screen and send the invitation.</li><li>Return to fviainboxes.com, click Get Email, open the message, copy its link address, and paste the link into another admin profile. Repeat for every profile.</li></ol>

      <h3>“Sorry, something went wrong” when joining a BM</h3>
      <p>Join later with the following link, replacing <strong>replacewithyourbmid</strong> with the BM ID:</p>
      <p><a href="https://business.facebook.com/latest/settings/business_users/?nav_ref=bm_settings_redirect_migration&amp;bm_redirect_migration=true&amp;business_id=replacewithyourbmid" target="_blank" rel="noopener">Open the Business Users join link</a>.</p>

      <h3>Unable to access Meta Business Suite</h3>
      <ol><li>Click “Create a Facebook Page”.</li><li>Use a realistic random name and category.</li><li>Open the BM, or go to <a href="https://business.facebook.com" target="_blank" rel="noopener">business.facebook.com</a>.</li><li>If the issue remains, invite that profile to a page from your employee profile.</li></ol>`,

    'accessing-emails': `
      <h2>Where to Access Emails from the Accounts and Temporary Mail</h2>

      <h3>Moakt.com (Occasionally offline)</h3>
      <ul><li>drmail.com</li><li>email domains that start with TMP</li><li>any email with MOAKT</li></ul>

      <h3>Fviainboxes.com</h3>
      <ul><li>fviadropinbox.com</li><li>fviamail.work</li><li>fviainboxes.com</li><li>dropinboxes.com</li></ul>

      <h3>Outlook.com</h3>
      <ul><li>hotmail.com</li><li>outlook.com</li></ul>

      <h3>Inboxes.com</h3>
      <ul><li>blondmail.com</li><li>chapsmail.com</li><li>clowmail.com</li><li>dropjar.com</li><li>fivermail.com</li><li>getairmail.com</li><li>getmule.com</li><li>getnada.com</li><li>gimpmail.com</li><li>givmail.com</li><li>guysmail.com</li><li>inboxbear.com</li><li>replyloop.com</li><li>robot-mail.com</li><li>spicysoda.com</li><li>tafmail.com</li><li>temptami.com</li><li>tupmail.com</li><li>vomoto.com</li></ul>

      <h3>For BM’s Email</h3>
      <p>Search for website <a href="https://firstmail.ltd/webmail/login/" target="_blank" rel="noopener">https://firstmail.ltd/webmail/login/</a><br>Search website <a href="https://mail.cx/" target="_blank" rel="noopener">https://mail.cx/</a></p>

      <h3><a href="https://5smail.email/" target="_blank" rel="noopener">https://5smail.email/</a></h3>
      <ul><li>5smail.email</li></ul>

      <h3><a href="https://tempmail.plus/" target="_blank" rel="noopener">https://tempmail.plus/</a></h3>
      <ul><li>mailto.plus</li><li>fexpost.com</li><li>fexbox.org</li><li>mailbox.in.ua</li><li>rover.info</li><li>chitthi.in</li><li>fextemp.com</li><li>any.pink</li><li>merepost.com</li></ul>

      <h3><a href="https://smvmail.com/" target="_blank" rel="noopener">https://smvmail.com/</a></h3>
      <ul><li>smvmail.com</li></ul>

      <h3><a href="https://firstmail.ltd/webmail/login/" target="_blank" rel="noopener">https://firstmail.ltd/webmail/login/</a></h3>

      <h3><a href="https://mail.td/en" target="_blank" rel="noopener">https://mail.td/en</a></h3>
      <ul><li>end.tw</li><li>nqmo.com</li><li>qabq.com</li><li>uuf.me</li><li>6n9.net</li></ul>

      <h3>Yandex Emails</h3>
      <ul><li>This is likely an email owned by us or one of our team members. We’ll have to get the code for you in this case.</li></ul>

      <h3><a href="https://emailfake.com/" target="_blank" rel="noopener">https://emailfake.com/</a></h3>
      <ul><li>hormails.com</li><li>zuldev.live</li><li>winmail.vip</li><li>unioc.asia</li><li>slushpools.cloud</li><li>lechatiao.com</li><li>xyxy.app</li><li>gmail2.gq</li><li>code-gmail.com</li><li>supplementsdiary.com</li><li>ppqifei.top</li><li>fviamail.com</li><li>urbanovalife.com</li><li>tuana.vip</li><li>24mail.top</li><li>monyal.sbs</li><li>maximail.shop</li><li>raveqxon.blog</li><li>vps79.com</li><li>khacdauquoctien.com</li><li>budistore.me</li><li>putameda.com</li><li>dramamixio.icu</li><li>ketua.id</li><li>p-aac.top</li><li>jagomail.com</li><li>myhochzeitsfilm.de</li><li>pdood.com</li><li>capcut.digital</li><li>linkbm365.com</li><li>generator1email.com</li><li>11jac.com</li><li>server-millionaire.com</li><li>pawgpt.nl</li><li>onlinecmail.com</li><li>cloudgen.world</li><li>681mail</li></ul>

      <h3><a href="https://282mail.com/" target="_blank" rel="noopener">https://282mail.com/</a></h3>
      <ul><li>16888888.cyou</li><li>17666688.shop</li><li>282mail.com</li><li>2famail.com</li><li>bsdu32.buzz</li><li>doxu243.buzz</li><li>easyme.pro</li><li>evergreenco.shop</li><li>layueming.pics</li><li>mailmomy.com</li><li>mingyuekeji.online</li><li>mingyueming.click</li><li>mingyueming.shop</li><li>mingyukeji.lol</li><li>nuxh62.space</li><li>proid.cloud-ip.cc</li><li>protect.support</li><li>sbook.pics</li><li>xikemail.com</li><li>xue32.buzz</li></ul>

      <p>If unsure, try inboxes.com or you can check to confirm with <a href="https://verifymail.io/" target="_blank" rel="noopener">https://verifymail.io/</a></p>

      <h3><a href="https://cvlmail.net" target="_blank" rel="noopener">https://cvlmail.net</a></h3>
      <ul><li>cvlmail.net</li></ul>

      <p>To urgently change an unavailable email on the Business Manager, go to Business Info under Business Settings and change the email.</p>`,

    'accessing-emails-dutch': `
      <h2>Waar je toegang krijgt tot e-mails van accounts en tijdelijke e-maildiensten</h2>

      <h3>Moakt.com (soms offline)</h3>
      <ul><li>drmail.com</li><li>e-maildomeinen die beginnen met TMP</li><li>elk e-mailadres met MOAKT</li></ul>

      <h3>Fviainboxes.com</h3>
      <ul><li>fviadropinbox.com</li><li>fviamail.work</li><li>fviainboxes.com</li><li>dropinboxes.com</li></ul>

      <h3>Outlook.com</h3>
      <ul><li>hotmail.com</li><li>outlook.com</li></ul>

      <h3>Inboxes.com</h3>
      <ul><li>blondmail.com</li><li>chapsmail.com</li><li>clowmail.com</li><li>dropjar.com</li><li>fivermail.com</li><li>getairmail.com</li><li>getmule.com</li><li>getnada.com</li><li>gimpmail.com</li><li>givmail.com</li><li>guysmail.com</li><li>inboxbear.com</li><li>replyloop.com</li><li>robot-mail.com</li><li>spicysoda.com</li><li>tafmail.com</li><li>temptami.com</li><li>tupmail.com</li><li>vomoto.com</li></ul>

      <h3>Voor het e-mailadres van de BM</h3>
      <p>Zoek naar de website <a href="https://firstmail.ltd/webmail/login/" target="_blank" rel="noopener">https://firstmail.ltd/webmail/login/</a><br>Zoek op de website <a href="https://mail.cx/" target="_blank" rel="noopener">https://mail.cx/</a></p>

      <h3><a href="https://5smail.email/" target="_blank" rel="noopener">https://5smail.email/</a></h3>
      <ul><li>5smail.email</li></ul>

      <h3><a href="https://tempmail.plus/" target="_blank" rel="noopener">https://tempmail.plus/</a></h3>
      <ul><li>mailto.plus</li><li>fexpost.com</li><li>fexbox.org</li><li>mailbox.in.ua</li><li>rover.info</li><li>chitthi.in</li><li>fextemp.com</li><li>any.pink</li><li>merepost.com</li></ul>

      <h3><a href="https://smvmail.com/" target="_blank" rel="noopener">https://smvmail.com/</a></h3>
      <ul><li>smvmail.com</li></ul>

      <h3><a href="https://firstmail.ltd/webmail/login/" target="_blank" rel="noopener">https://firstmail.ltd/webmail/login/</a></h3>

      <h3><a href="https://mail.td/en" target="_blank" rel="noopener">https://mail.td/en</a></h3>
      <ul><li>end.tw</li><li>nqmo.com</li><li>qabq.com</li><li>uuf.me</li><li>6n9.net</li></ul>

      <h3>Yandex-e-mails</h3>
      <ul><li>Dit is waarschijnlijk een e-mailadres dat van ons of van een van onze teamleden is. In dat geval moeten wij de code voor je opvragen.</li></ul>

      <h3><a href="https://emailfake.com/" target="_blank" rel="noopener">https://emailfake.com/</a></h3>
      <ul><li>hormails.com</li><li>zuldev.live</li><li>winmail.vip</li><li>unioc.asia</li><li>slushpools.cloud</li><li>lechatiao.com</li><li>xyxy.app</li><li>gmail2.gq</li><li>code-gmail.com</li><li>supplementsdiary.com</li><li>ppqifei.top</li><li>fviamail.com</li><li>urbanovalife.com</li><li>tuana.vip</li><li>24mail.top</li><li>monyal.sbs</li><li>maximail.shop</li><li>raveqxon.blog</li><li>vps79.com</li><li>khacdauquoctien.com</li><li>budistore.me</li><li>putameda.com</li><li>dramamixio.icu</li><li>ketua.id</li><li>p-aac.top</li><li>jagomail.com</li><li>myhochzeitsfilm.de</li><li>pdood.com</li><li>capcut.digital</li><li>linkbm365.com</li><li>generator1email.com</li><li>11jac.com</li><li>server-millionaire.com</li><li>pawgpt.nl</li><li>onlinecmail.com</li><li>cloudgen.world</li><li>681mail</li></ul>

      <h3><a href="https://282mail.com/" target="_blank" rel="noopener">https://282mail.com/</a></h3>
      <ul><li>16888888.cyou</li><li>17666688.shop</li><li>282mail.com</li><li>2famail.com</li><li>bsdu32.buzz</li><li>doxu243.buzz</li><li>easyme.pro</li><li>evergreenco.shop</li><li>layueming.pics</li><li>mailmomy.com</li><li>mingyuekeji.online</li><li>mingyueming.click</li><li>mingyueming.shop</li><li>mingyukeji.lol</li><li>nuxh62.space</li><li>proid.cloud-ip.cc</li><li>protect.support</li><li>sbook.pics</li><li>xikemail.com</li><li>xue32.buzz</li></ul>

      <p>Als je het niet zeker weet, probeer dan inboxes.com of controleer het via <a href="https://verifymail.io/" target="_blank" rel="noopener">https://verifymail.io/</a>.</p>

      <h3><a href="https://cvlmail.net" target="_blank" rel="noopener">https://cvlmail.net</a></h3>
      <ul><li>cvlmail.net</li></ul>

      <p>Als je met spoed een niet-beschikbaar e-mailadres in Business Manager moet wijzigen, ga je in Bedrijfsinstellingen naar Bedrijfsinformatie en wijzig je daar het e-mailadres.</p>`
  };
}());
