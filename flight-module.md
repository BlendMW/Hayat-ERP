Flights Module Documentation - Hayat ERP
________________________________________
1. Overview
The Flights Module provides a complete platform for managing all aspects of flight bookings, integrating with various airlines, GDS systems (such as Sabre), and aggregators. It offers advanced search capabilities, dynamic pricing, and real-time availability, with full support for ancillary services and charter flight management. The module is multi-tenant and highly configurable, supporting B2C, B2B, and corporate users.
________________________________________
2. Core Features
2.1 Integration with Sabre GDS and Multiple Airline APIs
•	Description:
o	Centralized management of flights across multiple airlines using Sabre GDS and up to 15 direct airline APIs. This integration supports both scheduled and charter flights, providing a broad range of options.
o	The integration is modular, allowing new APIs to be added without major system changes.
•	Components:
o	API Gateway: Routes all requests to the appropriate airline or GDS API based on availability and priority settings.
o	Data Normalization: Standardizes data from various APIs (e.g., flight details, prices, rules) to provide consistent results across sources.
o	Real-Time Updates: Uses webhooks and polling mechanisms to keep flight availability and schedules current.
•	Entities Involved:
o	Flight, Airline, Supplier, APIConnection
•	Additional Details:
o	A more scalable API architecture using AWS API Gateway should be considered for handling these requests, simplifying the management of multiple external integrations (e.g., Sabre, airline APIs).
•	Entities:
o	APIConnection: Must include authentication keys, endpoints, request/response formats, and error-handling protocols.
2.2 Advanced Search Filters
•	Filter Options:
o	Enables users to filter results based on:
	Flight Class: Economy, Business, First.
	Price Range: User-defined filtering limits.
	Departure/Arrival Time: Selection of time ranges.
	Airline: Filter by specific airlines or alliances.
	Layover Duration: Short, medium, or long layovers.
	Stopovers: Direct flights only, 1-stop, or multiple stops.
	Fare Conditions: Refund policies, baggage allowances, and in-flight services.
•	Use Case: Enhances search efficiency by presenting relevant results based on user preferences, increasing the likelihood of conversion.
•	Entities Involved:
o	Flight, SearchQuery, UserPreferences
•	Scalability Consideration:
o	Each search filter should be configurable based on the tenant's business model. For example, some tenants may only wish to display certain airlines or filter by specific fare classes.
•	Multi-Currency and i18n:
o	Ensure filters can manage currency conversion (for pricing) and multi-language support (i18n) to serve global markets.
•	Entities:
o	SearchQuery: Should track not only the filters used but also contextual data such as currency, locale, and tenant preferences.
2.3 Real-Time Availability & Schedules
•	Description:
o	Displays flight schedules and availability in real-time, with updates sourced from airline and GDS systems.
•	Ticket Rules & Fare Classes:
o	Provides visibility into ticket rules and fare classes (Economy, Premium Economy, Business, First), including restrictions (e.g., non-refundable tickets) and benefits (e.g., lounge access).
•	Inventory Management:
o	Syncs with airline systems to track seat availability, updating seat maps dynamically when bookings are made or canceled.
•	Entities Involved:
o	Flight, Fare, SeatInventory, Schedule
•	Improvement:
o	AWS Lambda can be used to handle real-time updates from airlines and charter systems asynchronously, ensuring schedules and fare classes are always updated with minimal latency.
•	Entities:
o	SeatInventory: Includes fields for dynamic seat allocation and reserved seat hold durations.
o	Schedule: Tracks historical changes in schedules for auditing and reporting.
2.4 Booking Management
•	Multi-Step Booking Flow:
o	Guides users through the entire booking process:
1.	Flight Selection based on search criteria.
2.	Passenger Details input (names, passport information).
3.	Seat Selection from the seat map.
4.	Add-Ons like meals or extra baggage.
5.	Payment & Confirmation.
•	PNR Generation:
o	The system generates a unique Passenger Name Record (PNR) upon booking confirmation, compliant with GDS standards.
•	Entities Involved:
o	Booking, Passenger, PNR, Payment, AncillaryService
•	Considerations:
o	Ensure PNR generation is isolated per tenant in a multi-tenant environment to prevent conflicts.
o	The booking flow may vary for corporate users (B2B), where they might reserve without immediate payment and issue tickets later.
•	Entities:
o	PNR: Should include relationships to loyalty program data and supplier agreements (for partner airlines).
2.5 Charter Flight Integration
•	Management & Display:
o	Admins can manage charter flight inventories, and users can view charter options alongside regular flights.
•	Dynamic Pricing:
o	Admins can set price rules based on demand, seat availability, and time until departure.
•	Standalone Option:
o	Users can choose charter flights separately or mix them with scheduled flights during booking.
•	Entities Involved:
o	CharterFlight, Supplier, PricingRule
•	Scalability:
o	Since charter flight pricing is dynamic, create a system where admins can input demand rules, seasonal prices, or seat-based prices and automate updates using AWS tools.
•	Entities:
o	CharterFlight: Should include advanced pricing algorithms that adjust based on seat availability, booking velocity, and demand forecasting.
2.6 Multi-Source Management
•	Admin Controls:
o	Admins can set priorities for flight sources (GDS, airline APIs, charter suppliers). This feature ensures the system selects the most efficient source for each search.
•	Use Case:
o	Adapts flight search results to the business needs of each tenant, ensuring the most relevant flights based on availability and profitability are displayed.
•	Entities Involved:
o	FlightSource, SourcePriority
•	Scalability:
o	Introduce a more detailed source-priority strategy per tenant. Each tenant should be able to set specific source prioritization and override at the user level.
•	Entities:
o	SourcePriority: Add rules for prioritization (e.g., direct airline API > GDS > aggregator).
2.7 Ancillary Seat Management
•	Seat Selection System:
o	Users can select seats from available seat maps, with premium seats highlighted.
•	Add-Ons:
o	The system integrates additional services like extra baggage, meals, and lounge access during the booking process.
•	Entities Involved:
o	SeatMap, AncillaryService, Booking
•	Scalability:
o	Make seat selection and add-ons configurable per airline or flight type (charter vs. scheduled flights) as different airlines have different ancillary service rules.
•	Entities:
o	SeatMap: Tracks seat pricing, availability, and user preferences (e.g., aisle or window).
o	AncillaryService: Includes attributes like service provider, cost breakdown, and service restrictions.
2.8 Post-Booking Management
•	Modification:
o	Users can modify or cancel their bookings, with conditions enforced based on ticket rules (e.g., non-refundable policies).
•	Refund Policies:
o	Automates refund processing, linking directly to the payment system and following airline policies.
•	Entities Involved:
o	Booking, Refund, FlightPolicy
•	Scalability:
o	Automated refunds should support partial refunds and vouchers for non-refundable tickets, requiring tight integration with Payment and Finance modules.
•	Entities:
o	Refund: Fields for partial refund calculations, voucher issuance, and loyalty program connections.
2.9 Automated Notifications
•	Communication Channels:
o	Integrates with email, SMS, and push notification services for booking confirmations, flight updates, check-in reminders, and more.
•	Customizable Templates:
o	Admins can manage templates for various notifications to maintain consistent branding.
•	Entities Involved:
o	Notification, User, CommunicationChannel
•	AWS Integration:
o	Use AWS SNS (Simple Notification Service) for managing large-scale push notifications and emails.
•	Entities:
o	Notification: Includes fields for delivery status, error tracking, and retries in case of failed sends.
2.10 Loyalty Program Integration
•	System Options:
o	Integrates with third-party loyalty programs or manages loyalty points internally.
•	Points Accumulation:
o	Users earn points based on their bookings, which can be redeemed for upgrades or discounts on future flights.
•	Entities Involved:
o	LoyaltyProgram, User, Transaction
•	Scalability:
o	Extend the loyalty program to support tenant-specific rewards. Some tenants may want custom loyalty point systems (e.g., airlines vs. travel agents).
•	Entities:
o	LoyaltyProgram: Includes relationships to flights, bookings, and tenant-specific settings (e.g., points multiplier for corporate clients).
________________________________________
3. Additional Scenarios and Workflows
3.1 Meta Search Integration Workflow
•	Description: Integrates with external meta-search providers (e.g., Skyscanner) to enable users to compare flight prices without leaving the platform.
•	Flow:
1.	User initiates a flight search.
2.	System queries internal and external APIs for price comparisons.
3.	Aggregated results are displayed.
•	Entities Involved: MetaSearch, ExternalProvider
•	Scalability:
1.	Build a meta-search abstraction layer for communication with multiple comparison platforms (e.g., Skyscanner, Google Flights) and centralize comparison results for uniform UI display.
•	Entities:
1.	MetaSearchResult: Stores comparison data, links to external platforms, and affiliate commissions.
3.2 Multi-Tenant Considerations
•	Custom Branding: Each tenant can customize their interface with branding (logo, colors, domain).
•	Tenant-Specific Configurations: Allows tenants to set flight source priorities and manage booking rules.
•	Credit Control and Limitations: Tenants can set spending limits or booking restrictions.
•	Branding Customization:
o	Support dynamic theming using AWS Amplify’s built-in capabilities to control branding across platforms (web, mobile).
•	Credit Control:
o	Use an accounting or wallet system where tenants have predefined credit limits managed by the admin.
3.3 Book Now, Issue Later Flow
•	Description: Enables users (especially B2B agents) to reserve a flight with the option to finalize payment and issue the ticket later.
•	Flow:
1.	User selects a flight and reserves it.
2.	Timer and notification system tracks the hold period.
3.	User completes payment, and the ticket is issued.
•	Scalability:
1.	Implement a flexible hold mechanism using AWS Lambda to manage booking holds and timeouts.
3.4 Full Transaction Tracking Scenario
•	Description: Tracks every action taken by users, suppliers, and admins for auditing purposes.
•	Entities: TransactionLog, ActionType (Booking, Modification, Cancellation), UserRole (Admin, Supplier, Customer)
3.5 Primary Supplier Management
•	Description: Allows admins to define primary suppliers for issuing tickets and prioritizing preferred partners.
________________________________________
4. Entities and ERD (Entity Relationship Diagram)
•	Entities:
1.	HayatFlight: Attributes - FlightID, AirlineID, FlightNumber, DepartureTime, ArrivalTime, OriginAirportID, DestinationAirportID, FareClasses, AvailableSeats, FlightStatus, TenantID.
2.	HayatAirline: Attributes - AirlineID, Name, IATA Code, LogoURL, ContactDetails, TenantID.
3.	HayatAirport: Attributes - AirportID, Name, City, Country, IATA Code, Timezone.
4.	HayatBooking: Attributes - BookingID, FlightID, UserID, PNR, Status, PaymentStatus, TotalPrice, BookingDate, TenantID.
5.	HayatUser: Attributes - UserID, Name, Email, Phone, LoyaltyPoints, UserType, TenantID.
6.	HayatPayment: Attributes - PaymentID, BookingID, PaymentMethod, TransactionID, Amount, Currency, PaymentDate, PaymentStatus.
7.	HayatAncillaryService: Attributes - ServiceID, BookingID, ServiceType, Price, ServiceStatus, TenantID.
8.	HayatSupplier: Attributes - SupplierID, Name, Type, APIEndpoint, CommissionRate, PriorityLevel, TenantID.
9.	HayatFare: Attributes - FareID, FlightID, FareClass, BasePrice, Rules, BaggageAllowance.
10.	HayatCharterFlight: Attributes - CharterID, FlightID, CustomPricing, CharterOperator, Availability.
11.	HayatNotification: Attributes - NotificationID, UserID, BookingID, Type, Channel, SentTimestamp, DeliveryStatus.
12.	HayatLoyaltyProgram: Attributes - LoyaltyProgramID, UserID, Points, Tier, PointsExpiry, TenantID.
13.	HayatMetaSearch: Attributes - MetaSearchID, FlightID, SupplierID, ComparisonPrice, URL, AffiliateCommission.
ERD Diagram:
1.	Create a visual representation using tools like Lucidchart, Draw.io, or MySQL Workbench to visualize entity relationships.
________________________________________
5. Testing Strategy
•	Unit Tests:
o	Tenant-Specific Tests: Ensure coverage of multi-tenant edge cases.
o	Seat Selection: Validate seat reservation and release timings across tenants.
•	Integration Tests:
o	Meta Search: Validate data flow and accuracy of external API aggregation.
•	End-to-End Tests:
o	Multi-Currency: Test the booking flow in various currencies for accurate conversions.
o	Multi-Language: Verify system performance across localized versions.
•	Security Testing:
o	Validate encryption of payment and PNR data.
o	Secure APIs using JWT authentication.
________________________________________
6. Deployment Strategy 
•	CI/CD Integration:
o	Ensure that the CI/CD pipelines automatically trigger builds, run tests, and deploy the application whenever changes are made to the codebase. This will guarantee consistency and reduce manual intervention in deployments.
o	Use AWS CodePipeline to automate backend deployments, which will also integrate testing phases using Mocha for APIs to validate the integrity of new code before it reaches production.
o	For frontend deployment, AWS Amplify will be used, which supports automated builds and deployments with testing via Jest. This setup will keep the frontend and backend synchronized and minimize downtime.
•	Monitoring and Logging:
o	AWS CloudWatch: Set up to track the performance and availability of APIs, Lambda functions, and other backend services. CloudWatch will help to visualize key metrics such as API latency, error rates, and request counts.
o	Implement detailed logging for each service to capture information on failures, usage patterns, and performance anomalies. These logs will be critical for troubleshooting issues and optimizing the system.
o	Set up CloudWatch Alarms to alert the development and operations teams of any service interruptions, allowing for proactive intervention before the issues escalate.
•	Backup and Recovery:
o	Use AWS RDS automated backups for database recovery. Ensure backup schedules are set up correctly for frequent snapshots, enabling quick recovery in case of data loss.
o	Implement versioning and backup strategies for configuration files and important application data stored in AWS S3.
•	Security and Compliance:
o	Ensure all API endpoints are protected using AWS API Gateway with JWT-based authentication. This will secure the communication between frontend applications and the backend.
o	Set up security groups and IAM roles in AWS to limit access to sensitive data and services based on least-privilege principles.
o	Encrypt sensitive information, such as PNR data and payment details, using AWS KMS (Key Management Service) to comply with data protection regulations like GDPR.
 
Cursor AI Instructions for Flights Module Development
________________________________________
1. Integration with Sabre GDS and Multiple Airline APIs
Prompt:
•	Objective: "Build a module that integrates multiple airline APIs (up to 15) and Sabre GDS into a single unified platform. This system must manage flights from multiple sources efficiently."
•	Tasks:
1.	API Gateway Setup:
	"Create an API gateway that routes requests based on availability and priority settings for each airline or GDS API."
	"Implement API connection objects that hold endpoints, authentication keys, request and response formats, and error-handling protocols for each API."
	"Ensure the gateway is modular, supporting the addition of new APIs with minimal changes."
2.	Data Normalization:
	"Develop a function that standardizes flight data (prices, availability, rules) from different APIs into a consistent format."
3.	Real-Time Updates:
	"Set up AWS Lambda functions to receive webhook notifications for flight status updates. Implement polling for APIs that do not support webhooks."
	"Use AWS CloudWatch to monitor these updates and log errors."
Entities:
•	Flight, Airline, Supplier, APIConnection
________________________________________
2. Advanced Search Filters
Prompt:
•	Objective: "Develop a comprehensive search feature for filtering flights based on multiple criteria such as class, price, time, and airline."
•	Tasks:
1.	Filter Implementation:
	"Implement dynamic filters allowing users to select flight class, price range, departure/arrival times, airline, layover duration, stopovers, and fare conditions."
2.	Tenant-Specific Filters:
	"Design the search filter system to be configurable based on the tenant's preferences. Allow tenants to control which filters are available for their customers."
3.	Multi-Currency and i18n Support:
	"Add support for currency conversion using an external service (e.g., AWS Currency Exchange Service) and localization features using Amplify’s i18n capabilities."
Entities:
•	SearchQuery, UserPreferences
________________________________________
3. Real-Time Availability & Schedules
Prompt:
•	Objective: "Develop a real-time flight schedule and availability management system."
•	Tasks:
1.	Lambda Functions:
	"Use AWS Lambda functions to handle real-time flight data updates asynchronously from airlines and charter systems."
	"Create a historical tracking system for schedule changes using AWS DynamoDB to log changes."
2.	Fare Class Management:
	"Display different fare classes with rules and benefits. Ensure that any changes in fare classes (e.g., availability) are updated in real-time."
Entities:
•	SeatInventory, Schedule, Flight, Fare
________________________________________
4. Booking Management
Prompt:
•	Objective: "Develop a multi-step booking management system that supports different user flows (B2C, B2B) and handles PNR generation."
•	Tasks:
1.	Booking Flow:
	"Develop a booking flow that guides the user through flight selection, passenger details entry, seat selection, add-ons, and payment."
2.	PNR System:
	"Implement a PNR generation system compliant with GDS standards, ensuring each tenant’s PNRs are isolated to avoid conflicts."
3.	Multi-Tenant Variations:
	"Add conditional steps for corporate users (e.g., allow booking without immediate payment). Integrate this with the loyalty and payment systems."
Entities:
•	Booking, Passenger, PNR, Payment, AncillaryService
________________________________________
5. Charter Flight Integration
Prompt:
•	Objective: "Implement a dynamic charter flight management system that includes flexible pricing rules."
•	Tasks:
1.	Inventory Management:
	"Allow admins to manage charter flight inventories separately and display them alongside regular flights."
2.	Dynamic Pricing:
	"Set up a pricing system where admins can define rules based on seat availability, demand, and booking velocity."
	"Integrate AWS Amplify’s API capabilities to automate these updates using AWS Lambda."
Entities:
•	CharterFlight, PricingRule
________________________________________
6. Multi-Source Management
Prompt:
•	Objective: "Develop an admin panel that allows the configuration of source priorities for flights, ensuring the system selects the most efficient sources for each search."
•	Tasks:
1.	Source Prioritization:
	"Allow admins to set specific priorities (e.g., direct airline API > GDS > aggregator) and override priorities at the user level if needed."
2.	Multi-Tenant Integration:
	"Make the source-priority settings configurable per tenant and ensure they can manage these independently."
Entities:
•	FlightSource, SourcePriority
________________________________________
7. Ancillary Seat Management
Prompt:
•	Objective: "Develop a system that allows users to choose seats and add services like extra baggage or meals."
•	Tasks:
1.	Seat Map Integration:
	"Design a seat selection system that displays available seats based on airline or flight type."
	"Make the seat map configurable for each airline’s rules and seat availability updates."
2.	Add-On Services:
	"Integrate ancillary services and allow users to select add-ons seamlessly during the booking flow."
Entities:
•	SeatMap, AncillaryService
________________________________________
8. Post-Booking Management
Prompt:
•	Objective: "Develop post-booking management functionality for modifications, cancellations, and refunds."
•	Tasks:
1.	Modification and Cancellation System:
	"Allow users to modify or cancel bookings, enforcing ticket rules (e.g., non-refundable tickets)."
2.	Automated Refund Processing:
	"Integrate the refund system directly with the payment and finance modules. Automate partial refunds and voucher issuance when applicable."
Entities:
•	Refund, FlightPolicy
________________________________________
9. Automated Notifications
Prompt:
•	Objective: "Build a notification system for sending booking confirmations, updates, and reminders."
•	Tasks:
1.	AWS SNS Integration:
	"Use AWS SNS for sending push notifications, emails, and SMS messages for various booking and flight status updates."
2.	Template Customization:
	"Enable admins to create and manage templates for different types of notifications to ensure branding consistency."
Entities:
•	Notification, CommunicationChannel
________________________________________
10. Loyalty Program Integration
Prompt:
•	Objective: "Create a loyalty program system that tracks points based on bookings and supports tenant-specific configurations."
•	Tasks:
1.	Points Accumulation:
	"Implement points accumulation based on bookings, configurable per tenant. Integrate with booking and payment systems for real-time updates."
2.	Redemption System:
	"Develop a feature allowing users to redeem points for upgrades, discounts, or exclusive offers."
Entities:
•	LoyaltyProgram, User, Transaction
________________________________________
3. Additional Scenarios and Workflows
3.1 Meta Search Integration Workflow
• Description: Integrates the platform with external meta-search providers (e.g., Skyscanner) to allow users to compare flight prices without leaving the platform.
•  Flow:
1.	User initiates a flight search.
2.	The system queries both internal and external APIs for price comparisons.
3.	Aggregates and displays results from different providers.
•  Entities Involved: MetaSearch, ExternalProvider
•  Scalability:
•	Implement a meta-search abstraction layer that can communicate with multiple comparison platforms (e.g., Skyscanner, Google Flights). This layer should centralize comparison results and display them uniformly.
•  Entities:
•	MetaSearchResult: Stores comparison data, links to external platforms, and affiliate commissions for each source.
3.2 Multi-Tenant Considerations
•  Custom Branding: Allows each tenant (B2B client) to customize the platform’s interface with their branding (e.g., logo, colors, domain).
•  Tenant-Specific Configurations: Tenants can prioritize flight sources and manage booking rules.
•  Credit Control and Limitations: Enables tenants to set spending limits or impose booking restrictions for their users.
•  Branding Customization:
•	Supports dynamic theming using AWS Amplify’s built-in capabilities, giving tenants control over branding across web and mobile platforms.
•  Credit Control:
•	Utilize an accounting or wallet system where tenants manage predefined credit limits, controlled by the admin.
•  Entities: Tenant, Wallet
3.3 Book Now, Issue Later Flow
•  Description: Enables users (especially B2B agents) to reserve a flight with an option to finalize payment and issue the ticket later.
•  Flow:
1.	User selects a flight and reserves it.
2.	A timer and notification system monitors the hold period.
3.	User completes payment, and the ticket is issued.
•  Implementation:
•	Use AWS Lambda to create a flexible hold mechanism that manages booking holds and timeouts, ensuring flights are temporarily held while awaiting payment.
•  Entities: Booking, HoldTimer
3.4 Full Transaction Tracking
Objective: Build a robust system to track all user, supplier, and admin actions for comprehensive audit and analytics.
Cursor AI Prompts:
•	"Develop a transaction logging system to capture all relevant actions (bookings, modifications, cancellations, refunds) performed by users, suppliers, and admins."
•	"Ensure that every transaction is logged with details including ActionType, UserID, Timestamp, BookingID, and other relevant metadata."
•	"Design a central TransactionLog table that records all actions, linking them with related entities like User, Booking, and Supplier."
•	"Integrate AWS CloudWatch and AWS DynamoDB for real-time monitoring and logging of all transactions to track anomalies and ensure data consistency."
Entities:
•	TransactionLog: Includes fields like TransactionLogID, ActionType, UserRole, UserID, Timestamp, AssociatedEntityID (e.g., BookingID), and Status.
3.5 Primary Supplier Management
Objective: Implement a feature that allows admins to set and prioritize primary suppliers for ticket issuance and booking management.
Cursor AI Prompts:
•	"Create an admin panel interface for managing and prioritizing primary suppliers. This should include settings for each supplier’s commission rate, priority level, and API endpoints."
•	"Enable admins to define rules for prioritizing suppliers based on cost, reliability, or availability. These rules should dynamically influence the booking flow, selecting the most appropriate supplier for each booking."
•	"Design the backend to support multi-tenancy by allowing different tenants to set their preferred suppliers."
Entities:
•	Supplier: Includes SupplierID, Name, APIEndpoint, CommissionRate, PriorityLevel.
•	SupplierPriorityRule: Contains RuleID, TenantID, RuleType (e.g., Cost, Reliability), Priority, EffectiveDate, and ExpirationDate.

________________________________________
Deployment and Testing Instructions
•	CI/CD:
o	"Integrate AWS Amplify and CodePipeline for frontend and backend CI/CD setups. Ensure automatic deployments with test suites."
•	Monitoring:
o	"Set up AWS CloudWatch for real-time monitoring of all API calls, Lambda functions, and potential errors."
•	Testing:
o	"Automate unit tests using Jest (frontend) and Mocha (backend). Ensure tests cover tenant-specific logic, seat selection, and booking processes."


Entity Creation and Standardization:
o	Objective: "Ensure all entities are named with the prefix 'Hayat' to maintain brand consistency and distinguish them from any other module entities."
o	Tasks:
1.	Update the naming convention for all entities to include the "Hayat" prefix, ensuring consistency across the module.
2.	Verify that attributes in each entity align with external API requirements through a mapping layer (e.g., mapping HayatFlight to the external API’s Flight structure).
Entity Usage and Integration:
o	Objective: "Map 'Hayat' branded entities to external GDS and airline API formats."
o	Tasks:
1.	Develop mapping functions to transform HayatFlight, HayatBooking, and other entities to the format required by the external systems, ensuring seamless integration.
2.	Create adapter functions that take API responses and convert them back into branded entities like HayatBooking, maintaining consistency within the system.
ERD Update:
o	Update: Create an Entity Relationship Diagram (ERD) reflecting the branded entities (HayatFlight, HayatBooking, etc.). Ensure all entity relationships are clearly defined, with attributes and connections reflecting the new naming scheme.

