from django.core.management.base import BaseCommand
from character.model.skill import Skill
import os
import json

DOMAIN_MAP = {
    "Magia": "arcana",
    "Magia Combinada": "arcana",
    "Cura": "splendor",
    "Ataque Divino": "splendor",
    "Desintoxicação": "splendor",
    "Barreira": "splendor",
    "Espada": {
        "Deus da Espada": "blade",
        "Deus da Água": "valor",
    },
}

TEMPLATE = {
    "type": "domainCard",
    "img": "systems/daggerheart/assets/icons/documents/items/card-play.svg",
    "system": {
        "attribution": {},
        "description": "",
        "resource": None,
        "actions": {},
        "domain": "",
        "level": 1,
        "recallCost": 0,
        "type": "ability",
        "inVault": False,
        "vaultActive": False,
        "loadoutIgnore": False,
        "domainTouched": None
    },
    "effects": [],
    "folder": None,
    "flags": {},
    "ownership": {"default": 0}
}

class Command(BaseCommand):
    help = 'Export every skill in the db as a domain card for Foundry.'

    def handle(self, *args, **options):
        output_dir = "foundry_skills_export"
        os.makedirs(output_dir, exist_ok=True)
        for skill in Skill.objects.all():
            domain = None
            # Arcana
            if skill.type in ["Magia", "Magia Combinada"]:
                domain = "arcana"
            # Splendor
            elif skill.type in ["Cura", "Ataque Divino", "Desintoxicação", "Barreira"]:
                domain = "splendor"
            # Espada subtypes
            elif skill.type == "Espada":
                if skill.school == "Deus da Espada":
                    domain = "blade"
                elif skill.school == "Deus da Água":
                    domain = "valor"
            # skip everything else
            if not domain:
                continue
            data = TEMPLATE.copy()
            data["name"] = f"{skill.name} - {skill.school}"
            data["system"] = data["system"].copy()
            data["system"]["domain"] = domain
            data["system"]["description"] = f"{skill.rank} - {skill.description}"
            filename = os.path.join(output_dir, f"{skill.name.replace(' ', '_')}.json")
            with open(filename, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        self.stdout.write(self.style.SUCCESS(f"Exported skills to {output_dir}/"))
