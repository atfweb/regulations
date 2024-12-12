from django.http import HttpResponse
from django.template.loader import select_template

from regulations.generator import api_reader
from regulations.generator.versions import fetch_grouped_history
from regulations.views import utils

from regulations.views.atf_notice_resources import *

import requests, json

def regulation_exists(label_id):
    client = api_reader.ApiReader()
    vr = client.regversions(label_id)
    return (vr and len(vr) > 0)


def get_versions(label_id):
    """ Get the current and next version of the regulation. """
    history = fetch_grouped_history(label_id)
    if history:
        future = [h for h in history if h['timeline'].is_future()]
        if len(future) > 0:
            next_version = future[-1]
        else:
            next_version = None

        current = [h for h in history if h['timeline'].is_present()]
        current_version = current[0]
        return (current_version, next_version)


def regulation(request, label_id):

    context = {}
    current_version, new_version = get_versions(label_id)
    if new_version:
        context['new_version'] = new_version
    context['current_version'] = current_version

    context['label_id'] = label_id
    context['reg_first_section'] = utils.first_section(
        label_id, current_version['version'])
    context['reg_part'] = label_id.split('-')[0]

    context['meta'] = utils.regulation_meta(label_id,
                                            current_version['version'])
    
    #siteimprove top pages
    filter_topics = [
        '447-11', '447-21', '447-31', '447-52', '447-53', '447-61',
        '478-11', '478-32a', '478-41', '478-71', '478-91', '478-111', '478-121', '478-124', '478-125', '478-141', '478-142',
        '479-11', '479-32', '479-34', '479-61', '479-62', '479-82', '479-84', '479-101', '479-111', '479-114',
        '555-26', '555-41', '555-71', '555-101', '555-121', '555-141', '555-142', '555-161', '555-180', '555-201', '555-11',
        '646-143', '646-146', '646-154',
        '771-5', '771-30', '771-35', '771-37', '771-42', '771-59', '771-75','771-82', '771-95', '771-120'
        ]
    top_pages = requests.get(site_improve_base + site_id + site_improve_popular, auth=(site_improve_user, site_improve_key))
    top_pages = top_pages.json()
    top_pages = top_pages.get("items")
    most_popular = [] 
    for page in top_pages:
        if context['label_id'] in page['url']:
            page_section = page['url'].split(label_id)
            page_section = page_section[1]
            page_section = page_section.split('/')
            if len(page_section) > 1:
                current_section = page_section[0]
                current_version = page_section[1]
                if current_section.startswith('-') == True:
                    label_string = str(context['label_id'] + current_section)
                    current_section = current_section[1:]
                    if label_string not in filter_topics:
                        if not any(item['label_string'] == label_string for item in most_popular):
                            most_popular.append({'regulation': context['label_id'] + '.' + current_section, 'version': current_version, 'label_string': label_string})
    most_popular = most_popular[:5]
    most_popular_context = []
    for regulation in most_popular:
        results = api_reader.ApiReader().search(
            regulation['regulation'], 'cfr',
            version=regulation['version'],regulation=context['label_id'],
            is_root='false', is_subpart='false',
        )
        for result in results['results']:
            if result['label_string'] == regulation['label_string']:
                title = result['match_title'].replace(regulation['regulation'], '')
                most_popular_context.append({'title': title[2:], 'label_id': result['label_string'], 'version': regulation['version']})
    context['most_popular'] = most_popular_context


    t = select_template([
        'regulations/landing_%s.html' % label_id,
        'regulations/landing_base.html',
        'regulations/generic_landing.html'])
    return HttpResponse(t.render(context, request))
