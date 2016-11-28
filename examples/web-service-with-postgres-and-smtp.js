var example = {
    "schema": 1, // Required -- Version of the conformance schema to which we're authoring.
    "service": {
        "uri": "https://prestonlee.com/hsp/hello-world", // Required -- stable ID across all versions.
        "support_url": "https://prestonlee.com", // Required -- where to get support, such as the vendor's website.
        "name": {
            "en": "Preston's Hello World App", // English is always required -- May change across builds. Other localizations are optional.
        },
        "version": {
            "name": "v1.3.42", // Required -- freeform
            "ordinal": "001.003.042" // Optional - For sorting purposes. Can be used to determine "v1.x or later".
        },
        "commit": "73f9f271ab6bf0b109fd5deddac47eb0d212456f",
        "created_at": "2016-10-14T17:28:03.343+00:00", // Required -- RFC3339
    },
    "exposures": [{
        "uri": "hspc://hsp/conformance/configuration/smart-on-fhir/v1", // Required -- we're a SMART-on-FHIR webapp in this example
        "name": {
            "en": "Hello Web UI!" // Required
        },
        "configuration": { // Required -- specific to the microschema. What schema fields map to container ENV variables.
            "default": { // Required -- The default container task
                "client_id": "SMART_ON_FHIR_CLIENT_ID",
                "client_secret": "SMART_ON_FHIR_CLIENT_SECRET"
            },
            "worker": { // We'll default another task for an asynchronous worker... let's say for sending email notifications or something.
                // Inherits everything from "default"
            }
        }
    }],
	"permissions": [
		"TODO"
	]
    "dependencies": [{
        "type": "hspc://hsp/conformance/configuration/smtp", // Required -- microschema URI
        "name": "Outbound Email", // Required -- String label
        "configuration": { // Required ENV variables -- specific to the microschema. Values will be automatically determined at runtime.
            "default": { // Required -- These are resolved when the container is run using the default ("RUN") task in the Dockerfile.
                "host": "HELLO_WORLD_SMTP_HOST",
                "port": "HELLO_WORLD_SMTP_PORT",
                "username": "HELLO_WROLD_SMTP_USERNAME",
                "password": "HELLO_WORLD_SMTP_PASSWORD"
            }
        }
    }, {
        "name": "PostgreSQL Database", // Required -- String label
        "type": "hspc://hsp/conformance/configuration/database/postgresql", // Required microschema URI
        "configuration": { // Required ENV variables -- specific to the microschema
            "default": { // The default "task"
                "name": {
                    "en": "Web Process"
                }, // Required -- localized human name.
                "url": "HELLO_WORLD_DATABASE_URL" // Will be something like "postgresql://username:password@localhost:5432/hello_world_development"
            },
            "rake db:seed": {
                "name": {
                    "en": "Database Setup"
                },
                // Will automatically inherit other "default" variables.
            },
            "rake test": {
                "name": {
                    "en": "Regression Test Suite & Dependency Checking"
                },
                "url": "HELLO_WORLD_DATABASE_TEST_URL" // Sets a different variable when running tests. E.g. "postgresql://username:password@localhost:5432/hello_world_test"
            }
        }
    }],
    "templates": [ // Required -- The requirements of the environment the container(s) are run upon.
        {
            "default": { // Required -- Production needs
                "tasks": {
                    "default": { // Reference to the "default" provided task.
                        "minimum": 1, // Optional number of instances.
                        "maximum": 8, // For orchestration autoscaling.
                        "memory": 1024 // In MiBs.
                    },
                    "worker": {
                        "minimum": 1
                    }
                }
            },
            "epic": { // Does NOT inherit defaults.
                // ...larger numbers than "default"...
            }

        }
    ]
}
print(JSON.stringify(example, null, "\t"));
